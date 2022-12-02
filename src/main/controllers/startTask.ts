import { ChildProcess, fork, ForkOptions } from 'child_process';
import { Event } from 'electron';
import * as fsSync from 'fs';

import { Keypair, PublicKey } from '@_koi/web3.js';
import axios from 'axios';
import cryptoRandomString from 'crypto-random-string';

import config from 'config';
import { Namespace, namespaceInstance } from 'main/node/helpers/Namespace';
import { ErrorType } from 'models';
import { TaskStartStopParam } from 'models/api';
import koiiTasks from 'services/koiiTasks';
import { throwDetailedError } from 'utils';

import mainErrorHandler from '../../utils/mainErrorHandler';
import { getAppDataPath } from '../node/helpers/getAppDataPath';
import initExpressApp from '../node/initExpressApp';

import getStakingAccountPublicKey from './getStakingAccountPubKey';

// eslint-disable-next-line
const bufferlayout = require('buffer-layout');
const OPERATION_MODE = 'service';
let LAST_USED_PORT = 10000;

const startTask = async (event: Event, payload: TaskStartStopParam) => {
  const { taskAccountPubKey } = payload;
  const activeAccount = await namespaceInstance.storeGet('ACTIVE_ACCOUNT');
  if (!activeAccount) {
    return throwDetailedError({
      detailed: 'Please select an active account',
      type: ErrorType.NO_ACTIVE_ACCOUNT,
    });
  }
  const mainWalletfilePath =
    getAppDataPath() + `/wallets/${activeAccount}_mainSystemWallet.json`;
  const mainSystemAccount = Keypair.fromSecretKey(
    Uint8Array.from(
      JSON.parse(fsSync.readFileSync(mainWalletfilePath, 'utf-8'))
    )
  );

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
    throw new Error(err);
  }
};

/**
 * Load tasks and generate task executables
 * @param {any[]} selectedTasks Array of selected tasks
 * @param {any} expressApp
 * @returns {any[]} Array of executable tasks
 */
async function loadTask(selectedTask: ISelectedTasks) {
  console.log('Selected Tasks', selectedTask);
  let res;
  try {
    res = await axios.get(
      config.node.GATEWAY_URL + '/' + selectedTask.taskAuditProgram
    );
  } catch (e) {
    console.error(e);
    return throwDetailedError({
      detailed: e,
      type: ErrorType.NO_TASK_SOURCECODE,
    });
  }
  if (res.data) {
    fsSync.mkdirSync(getAppDataPath() + '/executables', { recursive: true });
    fsSync.writeFileSync(
      getAppDataPath() + `/executables/${selectedTask.taskAuditProgram}.js`,
      res.data
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
  // Not passing all env to tasks for security reasons (Only passing ones that starts with SECRET)
  // TODO: Change the process.env secrets to gettingSecrets from the levelDB in future iteration
  const SECRETS_ENV = Object.keys(process.env)
    .filter((e) => e.includes('SECRET'))
    .reduce((obj, key) => {
      return Object.assign(obj, {
        [key]: process.env[key],
      });
    }, {});
  const options: ForkOptions = {
    env: SECRETS_ENV,
    silent: true,
  };
  // TODO: Get the task stake here
  // const STAKE = Number(process.env.TASK_STAKES?.split(',') || 0);
  const stakingAccPubkey = getStakingAccountPublicKey();
  const STAKE = selectedTask.stakeList[stakingAccPubkey];
  fsSync.mkdirSync(getAppDataPath() + `/namespace/${selectedTask.taskId}`, {
    recursive: true,
  });
  const log_file = fsSync.createWriteStream(
    getAppDataPath() + `/namespace/${selectedTask.taskId}/task.log`,
    { flags: 'a+' }
  );
  const childTaskProcess = fork(
    getAppDataPath() + `/executables/${selectedTask.taskAuditProgram}.js`,
    [
      `${selectedTask.taskName}`,
      `${selectedTask.taskId}`,
      `${LAST_USED_PORT}`,
      `${operationMode}`,
      `${mainSystemAccount.publicKey.toBase58()}`,
      `${secret}`,
      `${process.env.K2_NODE_URL || 'https://k2-testnet.koii.live'}`,
      `${process.env.SERVICE_URL}`,
      `${process.env.WEB3_STORAGE_API_KEY}`,
      `${STAKE}`,
    ],
    options
  );
  childTaskProcess.stdout.pipe(log_file);
  childTaskProcess.stderr.pipe(log_file);
  const namespace = new Namespace(
    selectedTask.taskId,
    expressApp,
    operationMode,
    mainSystemAccount,
    {
      task_name: selectedTask.taskName,
      task_id: selectedTask.taskId,
      task_audit_program: selectedTask.taskAuditProgram,
      task_manager: new PublicKey(selectedTask.taskManager),
      stake_pot_account: new PublicKey(selectedTask.stakePotAccount),
      bounty_amount_per_round: selectedTask.bountyAmountPerRound,
    }
  );
  LAST_USED_PORT += 1;
  return {
    namespace: namespace,
    child: childTaskProcess,
    expressAppPort: LAST_USED_PORT,
    secret: secret,
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

export default mainErrorHandler(startTask);
