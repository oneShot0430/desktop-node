import { ChildProcess, fork, ForkOptions } from 'child_process';
import { Event } from 'electron';
import * as fsSync from 'fs';
import { Transform } from 'stream';

import detectPort from 'detect-port';
import * as rfs from 'rotating-file-stream';

import { Keypair } from '@_koi/web3.js';
import {
  TaskData as TaskNodeTaskData,
  ITaskNodeBase,
} from '@koii-network/task-node';
import { DEFAULT_K2_NETWORK_URL, SERVER_PORT } from 'config/node';
// import cryptoRandomString from 'crypto-random-string';
import { SystemDbKeys } from 'config/systemDbKeys';
import { Express } from 'express';
import { get } from 'lodash';
import getUserConfig from 'main/controllers/getUserConfig';
import db from 'main/db';
import initOrca from 'main/node/helpers/initOrca';
import { getK2NetworkUrl } from 'main/node/helpers/k2NetworkUrl';
import { Namespace, namespaceInstance } from 'main/node/helpers/Namespace';
import koiiTasks from 'main/services/koiiTasks';
import { sleep } from 'main/util';
import { ErrorType, TaskRetryData } from 'models';
import { TaskStartStopParam } from 'models/api';
import { throwDetailedError } from 'utils';

import {
  forceKillChildProcess,
  getMainSystemAccountKeypair,
  getStakingAccountKeypair,
} from '../node/helpers';
import { getAppDataPath } from '../node/helpers/getAppDataPath';
import initExpressApp from '../node/initExpressApp';

import getStakingAccountPublicKey from './getStakingAccountPubKey';
import { getTaskMetadata } from './getTaskMetadata';
import { getTaskSource } from './getTaskSource';
import retryTask from './retryTask';
import { getTaskPairedVariablesNamesWithValues } from './taskVariables';

const OPERATION_MODE = 'service';
const logTimestampFormat: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: true,
};
const MAX_PORT_EXPOSURE_RETRIES = 3;

const startTask = async (
  _: Event,
  payload: TaskStartStopParam
): Promise<void> => {
  const { taskAccountPubKey, isPrivate } = payload;
  const isTaskRunning = await koiiTasks.getIsTaskRunning(taskAccountPubKey);
  console.log({ isTaskRunning });
  if (isTaskRunning) {
    return throwDetailedError({
      detailed: 'Task is already running',
      type: ErrorType.TASK_NOT_FOUND,
    });
  }
  const mainSystemAccount = await getMainSystemAccountKeypair();

  const taskInfo = await koiiTasks.getTaskState(taskAccountPubKey);

  if (!taskInfo) {
    console.error("Task doesn't exist");
    return throwDetailedError({
      detailed: 'Task not found',
      type: ErrorType.TASK_NOT_FOUND,
    });
  }

  const taskMetadata = await getTaskMetadata({} as Event, {
    metadataCID: taskInfo.task_metadata,
  });
  for (const tag of taskMetadata?.requirementsTags || []) {
    if (tag.type === 'ADDON' && tag.value === 'ORCA_TASK') {
      try {
        await initOrca();
      } catch (err: any) {
        console.error('ERROR STARTING TASK', err);
        return throwDetailedError({
          detailed: err,
          type: ErrorType.TASK_START,
        });
      }
      console.log('ORCA TASK ');
    }
  }
  const stakingAccKeypair = await getStakingAccountKeypair();
  const stakingPubkey = stakingAccKeypair.publicKey.toBase58();

  // if stake is undefined or 0 -> stop
  if (!taskInfo.stake_list[stakingPubkey]) {
    console.log("Can't start task, because it is not staked");

    return throwDetailedError({
      detailed: `Can't start task ${taskAccountPubKey}, because it is not staked`,
      type: ErrorType.TASK_START,
    });
  }

  // if task is not whitelisted -> stop, unless isPrivate is true
  if (!taskInfo.is_whitelisted && !isPrivate) {
    console.log("Can't start task, because it is not whitelisted");

    return throwDetailedError({
      detailed: `Can't start task ${taskAccountPubKey}, because it is not whitelisted`,
      type: ErrorType.TASK_START,
    });
  }

  console.log('STARTED TASK DATA', taskInfo?.task_name);

  const expressApp = await initExpressApp();
  let portExposure = await namespaceInstance.storeGet('Port_Exposure');
  console.log('port_exposure', portExposure);

  const { networkingFeaturesEnabled } = await getUserConfig();

  let numberOfPortExposureRetries = 0;

  if (!networkingFeaturesEnabled) {
    while (
      portExposure === 'Pending' &&
      numberOfPortExposureRetries < MAX_PORT_EXPOSURE_RETRIES
    ) {
      numberOfPortExposureRetries += 1;
      await sleep(10000);
      portExposure = await namespaceInstance.storeGet('Port_Exposure');
    }
  }

  try {
    console.log('LOADING TASK:', taskAccountPubKey);
    await loadTask({ taskAuditProgram: taskInfo.task_audit_program });

    await clearTaskRetryTimeout(taskAccountPubKey);
    const { namespace, child, expressAppPort, secret } = await executeTasks(
      { ...taskInfo, task_id: taskAccountPubKey },
      expressApp,
      OPERATION_MODE,
      mainSystemAccount
    );

    await koiiTasks.startTask(
      taskAccountPubKey,
      namespace,
      child,
      expressAppPort,
      secret
    );
    console.log('TASK STARTED:', taskAccountPubKey);
  } catch (err: any) {
    console.error('ERROR STARTING TASK', err);
    return throwDetailedError({
      detailed: err,
      type: ErrorType.TASK_START,
    });
  }
};

export async function clearTaskRetryTimeout(taskPubkey: string) {
  const allTaskRetryData: {
    [key: string]: TaskRetryData;
  } = (await namespaceInstance.storeGet(SystemDbKeys.TaskRetryData)) || {};

  const taskRetryData = get(allTaskRetryData, taskPubkey, null);
  if (taskRetryData?.timerReference) {
    clearTimeout(taskRetryData?.timerReference); // clear ongoing retry timerReference
  }

  if (taskRetryData) {
    taskRetryData.timerReference = null;
  }

  const payload: any = {
    ...allTaskRetryData,
    [taskPubkey]: taskRetryData,
  };

  namespaceInstance.storeSet(SystemDbKeys.TaskRetryData, payload);
}

/**
 * Load tasks and generate task executables
 * @param {any[]} selectedTasks Array of selected tasks
 * @param {any} expressApp
 * @returns {any[]} Array of executable tasks
 */
export async function loadTask({
  taskAuditProgram,
}: {
  taskAuditProgram: string;
}) {
  const executablesDirectoryPath = `${getAppDataPath()}/executables`;
  const presumedSourceCodePath = `${executablesDirectoryPath}/${taskAuditProgram}.js`;
  let shouldDownloadExecutable = !fsSync.existsSync(presumedSourceCodePath);

  if (!shouldDownloadExecutable) {
    const fileContent = fsSync.readFileSync(presumedSourceCodePath, 'utf8');
    shouldDownloadExecutable = fileContent.startsWith('<');
  }

  if (shouldDownloadExecutable) {
    const sourceCode: string = await getTaskSource({} as Event, {
      taskAuditProgram,
    });
    fsSync.mkdirSync(executablesDirectoryPath, { recursive: true });
    fsSync.writeFileSync(presumedSourceCodePath, sourceCode);
  }
}

/**
 * Initializes and executes tasks
 * @param {any[]} selectedTask Array of selected tasks
 * @param {any[]} executableTasks Array of executable tasks
 */
export async function executeTasks(
  selectedTask: Required<TaskNodeTaskData> & {
    stake_list: Record<string, number>;
  },
  expressApp: Express,
  operationMode: string,
  mainSystemAccount: Keypair
): Promise<{
  namespace: ITaskNodeBase;
  child: ChildProcess;
  expressAppPort: number;
  secret: string;
}> {
  const availablePort = await detectPort();

  // TODO: [Ghazanfer] Figure out why every IPC call is being made twice and update below code accordingly
  // eslint-disable-next-line @cspell/spellchecker
  const secret = 'Jt9Dwaz@kh*9efFBv51';
  const options: ForkOptions = {
    env: await getTaskPairedVariablesNamesWithValues({} as Event, {
      taskAccountPubKey: selectedTask.task_id,
    }),
    silent: true,
  };
  if (options.env === undefined) options.env = {};
  options.env.PATH = process.env.PATH;

  const stakingAccPubkey = await getStakingAccountPublicKey();
  const STAKE = selectedTask.stake_list[stakingAccPubkey];
  fsSync.mkdirSync(`${getAppDataPath()}/namespace/${selectedTask.task_id}`, {
    recursive: true,
  });
  let logFile;
  try {
    logFile = rfs.createStream('task.log', {
      size: '5M', // Maximum file size
      compress: 'gzip', // Compress rotated files using gzip
      path: `${getAppDataPath()}/namespace/${selectedTask.task_id}`, // Directory path for log files
    });

    // Event listener for the rotation event
    logFile.on('rotated', (filename) => {
      // Delete the previous log file when rotation occurs
      if (filename.includes('log.gz')) {
        fsSync.unlink(filename, (err) => {
          if (err) {
            console.error(`Error deleting log file ${filename}:`, err);
          } else {
            console.log(`Deleted log file ${filename}`);
          }
        });
      }
    });
    logFile.on('error', (error) => {
      console.error('ERROR IN TASK LOG listener', error);
    });
  } catch (error) {
    console.error('ERROR IN TASK LOG', error);
  }
  const childTaskProcess = fork(
    `${getAppDataPath()}/executables/${selectedTask.task_audit_program}.js`,
    [
      `${selectedTask.task_name}`,
      `${selectedTask.task_id}`,
      `${availablePort}`,
      `${operationMode}`,
      `${mainSystemAccount.publicKey.toBase58()}`,
      `${secret}`,
      `${getK2NetworkUrl() || DEFAULT_K2_NETWORK_URL}`,
      `${process.env.SERVICE_URL}`,
      `${STAKE}`,
      `${SERVER_PORT}`,
    ],
    options
  );

  const messageTransform = (
    formatter: (
      timestamp: string,
      messageContent: string,
      isError: boolean
    ) => string
  ): Transform =>
    new Transform({
      transform(data, encoding, callback) {
        try {
          const timestamp = new Date().toLocaleString(
            'en-US',
            logTimestampFormat
          );
          const isErrorMessage = data
            .toString()
            .toLowerCase()
            .includes('error');
          const message = formatter(timestamp, data.toString(), isErrorMessage);
          // Check if the stream is still writable before pushing data
          if (!this.writableEnded) {
            this.push(message);
            callback();
          } else {
            // Handle the situation when the stream is no longer writable
            const error = new Error(
              'Attempted to write after stream has ended'
            );
            console.error(error);
            callback(error);
          }
        } catch (error: any) {
          // Handle other unexpected errors
          console.error('Error in transform stream:', error);
          callback(error);
        }
      },
    });

  if (logFile) {
    childTaskProcess.stdout
      ?.pipe(
        messageTransform((timestamp, message) => `[${timestamp}] ${message}`)
      )
      .pipe(logFile)
      .on('error', (err) => {
        // Handle the error here
        console.error('Error in stream pipeline:', err);
        // Depending on your application, you might want to clean up resources or shut down the process
      });

    childTaskProcess.stderr
      ?.pipe(
        messageTransform((timestamp, message, isError) => {
          const label = isError ? 'ERROR' : 'WARNING';
          return `[${timestamp}] ${label}: ${message}`;
        })
      )
      .pipe(logFile)
      .on('error', (err) => {
        // Handle the error here
        console.error('Error in stream pipeline:', err);
        // Depending on your application, you might want to clean up resources or shut down the process
      });
  }

  childTaskProcess.on('error', async (err) => {
    console.error('Error starting child process:', err);
    koiiTasks.stopTask(selectedTask.task_id, true);
  });

  childTaskProcess.on('exit', async (code, signal) => {
    console.error(
      `Child process ${childTaskProcess.pid} exited with code ${code} and signal ${signal}`
    );
    const shouldRetry = code === 0;

    await sleep(2000);
    forceKillChildProcess(childTaskProcess);

    if (shouldRetry) {
      retryTask(
        selectedTask,
        expressApp,
        OPERATION_MODE,
        mainSystemAccount,
        executeTasks
      );
    }
  });

  const namespace = new Namespace({
    taskTxId: selectedTask.task_id,
    serverApp: expressApp,
    mainSystemAccount,
    db,
    rpcUrl: getK2NetworkUrl(),
    taskData: selectedTask,
  });

  return {
    namespace,
    child: childTaskProcess,
    expressAppPort: availablePort,
    secret,
  };
}

export default startTask;
