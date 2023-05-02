import { fork, ForkOptions } from 'child_process';
import { Event } from 'electron';
import * as fsSync from 'fs';
import { Transform } from 'stream';

import { Keypair } from '@_koi/web3.js';
import { TaskData as TaskNodeTaskData } from '@koii-network/task-node';
import { DEFAULT_K2_NETWORK_URL } from 'config/node';
import cryptoRandomString from 'crypto-random-string';
import { Express } from 'express';
import db from 'main/db';
import { getK2NetworkUrl } from 'main/node/helpers/k2NetworkUrl';
import { Namespace } from 'main/node/helpers/Namespace';
import koiiTasks from 'main/services/koiiTasks';
import { ErrorType, RawTaskData } from 'models';
import { TaskStartStopParam } from 'models/api';
import { throwDetailedError } from 'utils';

import { getMainSystemAccountKeypair } from '../node/helpers';
import { getAppDataPath } from '../node/helpers/getAppDataPath';
import initExpressApp from '../node/initExpressApp';

import getStakingAccountPublicKey from './getStakingAccountPubKey';
import { getTaskSource } from './getTaskSource';
import { getTaskPairedVariablesNamesWithValues } from './taskVariables';

const OPERATION_MODE = 'service';
let LAST_USED_PORT = 10000;
const logTimestampFormat: DateTimeFormatOptions = {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: true,
};

const startTask = async (_: Event, payload: TaskStartStopParam) => {
  const { taskAccountPubKey } = payload;

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

  console.log('STARTED TASK DATA', taskInfo);
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

    console.log('TASK STARTED:', taskAccountPubKey);
    await koiiTasks.taskStarted(
      taskAccountPubKey,
      namespace,
      child,
      expressAppPort,
      secret
    );
  } catch (err) {
    console.error('ERR-:', err);
    throw new Error(err as string);
  }
};

/**
 * Load tasks and generate task executables
 * @param {any[]} selectedTasks Array of selected tasks
 * @param {any} expressApp
 * @returns {any[]} Array of executable tasks
 */
async function loadTask({ taskAuditProgram }: { taskAuditProgram: string }) {
  console.log('taskAuditProgram', taskAuditProgram);

  const sourceCode = await getTaskSource({} as Event, { taskAuditProgram });
  if (sourceCode) {
    fsSync.mkdirSync(`${getAppDataPath()}/executables`, { recursive: true });
    fsSync.writeFileSync(
      `${getAppDataPath()}/executables/${taskAuditProgram}.js`,
      sourceCode
    );
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
) {
  const secret = cryptoRandomString({ length: 20 });

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
  const logFile = fsSync.createWriteStream(
    `${getAppDataPath()}/namespace/${selectedTask.task_id}/task.log`,
    { flags: 'a+' }
  );
  const childTaskProcess = fork(
    `${getAppDataPath()}/executables/${selectedTask.task_audit_program}.js`,
    [
      `${selectedTask.task_name}`,
      `${selectedTask.task_id}`,
      `${LAST_USED_PORT}`,
      `${operationMode}`,
      `${mainSystemAccount.publicKey.toBase58()}`,
      `${secret}`,
      `${getK2NetworkUrl() || DEFAULT_K2_NETWORK_URL}`,
      `${process.env.SERVICE_URL}`,
      `${STAKE}`,
    ],
    options
  );

  const messageTransform = (
    formatter: (timestamp: string, messageContent: string) => string
  ): Transform =>
    new Transform({
      transform(data, encoding, callback) {
        const timestamp = new Date().toLocaleString(
          'en-US',
          logTimestampFormat
        );
        const message = formatter(timestamp, data.toString());
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
      messageTransform(
        (timestamp, message) => `[${timestamp}] ERROR: ${message}`
      )
    )
    .pipe(logFile);

  childTaskProcess.on('error', (err) => {
    console.error('Error starting child process:', err);
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
    koiiTasks.taskStopped(selectedTask.task_id);
  });

  const namespace = new Namespace({
    taskTxId: selectedTask.task_id,
    serverApp: expressApp,
    mainSystemAccount,
    db,
    rpcUrl: getK2NetworkUrl(),
    taskData: selectedTask,
  });

  LAST_USED_PORT += 1;
  return {
    namespace,
    child: childTaskProcess,
    expressAppPort: LAST_USED_PORT,
    secret,
  };
}

interface DateTimeFormatOptions {
  localeMatcher?: 'best fit' | 'lookup' | undefined;
  weekday?: 'long' | 'short' | 'narrow' | undefined;
  era?: 'long' | 'short' | 'narrow' | undefined;
  year?: 'numeric' | '2-digit' | undefined;
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow' | undefined;
  day?: 'numeric' | '2-digit' | undefined;
  hour?: 'numeric' | '2-digit' | undefined;
  minute?: 'numeric' | '2-digit' | undefined;
  second?: 'numeric' | '2-digit' | undefined;
  timeZoneName?:
    | 'short'
    | 'long'
    | 'shortOffset'
    | 'longOffset'
    | 'shortGeneric'
    | 'longGeneric'
    | undefined;
  formatMatcher?: 'best fit' | 'basic' | undefined;
  hour12?: boolean | undefined;
  timeZone?: string | undefined;
}

export default startTask;
