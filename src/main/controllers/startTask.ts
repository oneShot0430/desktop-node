import { ChildProcess, fork, ForkOptions } from 'child_process';
import { Event } from 'electron';
import * as fsSync from 'fs';

import { PublicKey, Keypair } from '@_koi/web3.js';
import { DEFAULT_K2_NETWORK_URL } from 'config/node';
import cryptoRandomString from 'crypto-random-string';
import db from 'main/db';
import { getK2NetworkUrl } from 'main/node/helpers/k2NetworkUrl';
import { Namespace } from 'main/node/helpers/Namespace';
import koiiTasks from 'main/services/koiiTasks';
import { ErrorType } from 'models';
import { TaskStartStopParam } from 'models/api';
import { throwDetailedError } from 'utils';

import { getMainSystemAccountKeypair } from '../node/helpers';
import { getAppDataPath } from '../node/helpers/getAppDataPath';
import initExpressApp from '../node/initExpressApp';

import getStakingAccountPublicKey from './getStakingAccountPubKey';
import { getTaskSource } from './getTaskSource';
import { getPairedVariablesNamesWithValues } from './taskVariables';

// eslint-disable-next-line
const bufferlayout = require('buffer-layout');
const OPERATION_MODE = 'service';
let LAST_USED_PORT = 10000;

const startTask = async (_: Event, payload: TaskStartStopParam) => {
  const { taskAccountPubKey } = payload;

  const mainSystemAccount = await getMainSystemAccountKeypair();

  const taskInfo = koiiTasks.getTaskByPublicKey(taskAccountPubKey);
  console.log({ taskInfo });
  console.log('koiiTasks.getAllTasks()', koiiTasks.getAllTasks());
  if (!taskInfo) {
    console.error("Task doesn't exist");
    return throwDetailedError({
      detailed: 'Task not found',
      type: ErrorType.TASK_NOT_FOUND,
    });
  }
  const expressApp = await initExpressApp();
  try {
    console.log('LOADING TASK:', taskInfo.publicKey);
    await loadTask({ ...taskInfo.data, taskId: taskInfo.publicKey });
    const { namespace, child, expressAppPort, secret } = await executeTasks(
      { ...taskInfo.data, taskId: taskInfo.publicKey },
      expressApp,
      OPERATION_MODE,
      mainSystemAccount
    );
    console.log('TASK STARTED:', taskInfo.publicKey);
    await koiiTasks.taskStarted(
      taskAccountPubKey,
      namespace,
      child,
      expressAppPort,
      secret
    );

    // koiiTasks.runTimers();

    // const taskSrc = await loadTaskSource(
    //   src,
    //   new Namespace(
    //     taskAccountPubKey,
    //     expressApp,
    //     OPERATION_MODE,
    //     mainSystemAccount,
    //     {
    //       task_id: taskInfo.publicKey,
    //       task_name: taskInfo.data.taskName,
    //       task_manager: taskInfo.data.taskManager,
    //       task_audit_program: taskInfo.data.taskAuditProgram,
    //       stake_pot_account: taskInfo.data.stakePotAccount,
    //       bounty_amount_per_round: taskInfo.data.bountyAmountPerRound,
    //     }
    //   )
    // );
    // console.log('SETTING UP TASK');
    // await taskSrc.setup();
    // console.log('STARTING EXECUTING TASK');
    // const cronArray = await taskSrc.execute();
    // console.log('CRON ARRAY', cronArray);
    // await koiiTasks.taskStarted(taskAccountPubKey, cronArray);
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
async function loadTask({ taskAuditProgram }: ISelectedTasks) {
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
  selectedTask: ISelectedTasks,
  expressApp: any,
  operationMode: string,
  mainSystemAccount: Keypair
) {
  const secret = await cryptoRandomString({ length: 20 });

  const options: ForkOptions = {
    env: await getPairedVariablesNamesWithValues({} as Event, {
      taskAccountPubKey: selectedTask.taskId,
    }),
    silent: true,
  };

  // TODO: Get the task stake here
  // const STAKE = Number(process.env.TASK_STAKES?.split(',') || 0);
  const stakingAccPubkey = await getStakingAccountPublicKey();
  const STAKE = selectedTask.stakeList[stakingAccPubkey];
  fsSync.mkdirSync(`${getAppDataPath()}/namespace/${selectedTask.taskId}`, {
    recursive: true,
  });
  const logFile = fsSync.createWriteStream(
    `${getAppDataPath()}/namespace/${selectedTask.taskId}/task.log`,
    { flags: 'a+' }
  );
  const childTaskProcess = fork(
    `${getAppDataPath()}/executables/${selectedTask.taskAuditProgram}.js`,
    [
      `${selectedTask.taskName}`,
      `${selectedTask.taskId}`,
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
  childTaskProcess.stdout?.pipe(logFile);
  childTaskProcess.stderr?.pipe(logFile);
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
  });
  const namespace = new Namespace({
    taskTxId: selectedTask.taskId,
    serverApp: expressApp,
    mainSystemAccount,
    db,
    rpcUrl: getK2NetworkUrl(),
    taskData: {
      task_name: selectedTask.taskName,
      task_id: selectedTask.taskId,
      task_audit_program: selectedTask.taskAuditProgram,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      task_manager: new PublicKey(selectedTask.taskManager!),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      stake_pot_account: new PublicKey(selectedTask.stakePotAccount!),
      bounty_amount_per_round: selectedTask.bountyAmountPerRound,
    },
  });

  LAST_USED_PORT += 1;
  return {
    namespace,
    child: childTaskProcess,
    expressAppPort: LAST_USED_PORT,
    secret,
  };
}

// const loadTaskSource = async (src: string, namespace: Namespace) => {
//   // TODO: change below path to /var/log/namespace.task_id
//   // await fsPromises
//   //   .mkdir(`namespace/${namespace.taskData.task_id}`, { recursive: true })
//   //   .catch(console.error);
//   // const log_file = fsSync.createWriteStream(
//   //   `namespace/${namespace.taskData.task_id}/task.log`,
//   //   { flags: 'w' }
//   // );
//   // const logger = {
//   //   log: (...d: any) => {
//   //     log_file.write(util.format(...d) + '\n');
//   //   },
//   //   error: (...d: any) => {
//   //     log_file.write('ERROR: {' + util.format(...d) + '}\n');
//   //   },
//   // };
//   // const loadedTask = new Function(`
//   //     const [namespace, require, logger] = arguments;
//   //     const console = logger;
//   //     ${src};
//   //     return {setup, execute};
//   //   `);

//   // /*

//   //   */
//   // const _require = (module: string) => {
//   //   switch (module) {
//   //     case 'arweave':
//   //       return Arweave;
//   //     case 'axios':
//   //       return axios;
//   //     case '@_koi/web3.js':
//   //       return web3;
//   //     case 'crypto':
//   //       return () => {
//   //         /* */
//   //       };
//   //     case 'tweetnacl':
//   //       return nacl;
//   //     case 'bs58':
//   //       return bs58;
//   //     case 'node-cron':
//   //       return cron;
//   //     case 'bodyParser':
//   //       return bodyParser;
//   //     case 'bufferlayout':
//   //       return bufferlayout;
//   //     case 'dotenv':
//   //       return dotenv;
//   //     case 'smartweave':
//   //       return smartweave;
//   //     case 'base64':
//   //       return base64;
//   //     case 'cheerio':
//   //       return cheerio;
//   //     case 'puppeteer':
//   //       return puppeteer;
//   //   }
//   // };

//   // TODO: Instead of passing require change to _require and allow only selected node modules
//   // return loadedTask(namespace, _require, logger);
// };
interface ISelectedTasks {
  taskName: string;
  taskId: string;
  taskAuditProgram: string;
  taskManager?: string;
  stakePotAccount?: string;
  bountyAmountPerRound?: number;
  stakeList?: any;
}
interface IRunningTasks {
  [key: string]: {
    namespace: Namespace;
    child: ChildProcess;
    expressAppPort: number;
    secret: string;
  };
}

export default startTask;
