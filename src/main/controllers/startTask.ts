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
import { Express } from 'express';
import db from 'main/db';
import { getK2NetworkUrl } from 'main/node/helpers/k2NetworkUrl';
import { Namespace } from 'main/node/helpers/Namespace';
import koiiTasks from 'main/services/koiiTasks';
import { ErrorType, RawTaskData } from 'models';
import { TaskStartStopParam } from 'models/api';
import { throwDetailedError } from 'utils';

import {
  getMainSystemAccountKeypair,
  getStakingAccountKeypair,
} from '../node/helpers';
import { getAppDataPath } from '../node/helpers/getAppDataPath';
import initExpressApp from '../node/initExpressApp';

import getStakingAccountPublicKey from './getStakingAccountPubKey';
import { getTaskSource } from './getTaskSource';
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

const startTask = async (
  _: Event,
  payload: TaskStartStopParam
): Promise<void> => {
  const { taskAccountPubKey, isPrivate } = payload;
  const mainSystemAccount = await getMainSystemAccountKeypair();

  const taskInfo: RawTaskData | null =
    await koiiTasks.fetchDataAndValidateIfTask(taskAccountPubKey);

  if (!taskInfo) {
    console.error("Task doesn't exist");
    return throwDetailedError({
      detailed: 'Task not found',
      type: ErrorType.TASK_NOT_FOUND,
    });
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
  try {
    console.log('LOADING TASK:', taskAccountPubKey);
    await loadTask({ taskAuditProgram: taskInfo.task_audit_program });

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

/**
 * Load tasks and generate task executables
 * @param {any[]} selectedTasks Array of selected tasks
 * @param {any} expressApp
 * @returns {any[]} Array of executable tasks
 */
async function loadTask({ taskAuditProgram }: { taskAuditProgram: string }) {
  const executablesDirectoryPath = `${getAppDataPath()}/executables`;
  const presumedSourceCodePath = `${executablesDirectoryPath}/${taskAuditProgram}.js`;

  if (!fsSync.existsSync(presumedSourceCodePath)) {
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
async function executeTasks(
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
  const secret = 'secret';
  const options: ForkOptions = {
    env: await getTaskPairedVariablesNamesWithValues({} as Event, {
      taskAccountPubKey: selectedTask.task_id,
    }),
    silent: true,
  };

  const stakingAccPubkey = await getStakingAccountPublicKey();
  const STAKE = selectedTask.stake_list[stakingAccPubkey];
  fsSync.mkdirSync(`${getAppDataPath()}/namespace/${selectedTask.task_id}`, {
    recursive: true,
  });

  const logFile = rfs.createStream('task.log', {
    size: '3M', // Maximum file size
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
        const timestamp = new Date().toLocaleString(
          'en-US',
          logTimestampFormat
        );
        const isErrorMessage = data.toString().toLowerCase().includes('error');
        const message = formatter(timestamp, data.toString(), isErrorMessage);
        this.push(message);
        callback();
      },
    });

  childTaskProcess.stdout
    ?.pipe(
      messageTransform((timestamp, message) => `[${timestamp}] ${message}`)
    )
    .pipe(logFile);

  childTaskProcess.stderr
    ?.pipe(
      messageTransform((timestamp, message, isError) => {
        const label = isError ? 'ERROR' : 'WARNING';
        return `[${timestamp}] ${label}: ${message}`;
      })
    )
    .pipe(logFile);

  childTaskProcess.on('error', (err) => {
    console.error('Error starting child process:', err);
    koiiTasks.stopTask(selectedTask.task_id, true);
  });

  childTaskProcess.on('exit', (code, signal) => {
    if (code !== 0) {
      console.error(
        `Child process exited with code ${code} and signal ${signal}`
      );
      // Handle the error here
    } else {
      console.log('Child process exited successfully');
    }
    if (koiiTasks.RUNNING_TASKS[selectedTask.task_id]) {
      /**
       * The "on exit" event is triggered when the task is stopped,
       * so we don't need to call the stopTask method again
       */
      koiiTasks.stopTask(selectedTask.task_id, true);
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
