import { ipcMain } from 'electron';

import { Endpoints } from '../config/endpoints';
import mainErrorHandler from '../utils/mainErrorHandler';

import * as controllers from './controllers';
import errorHandler from './errorHandler';

const endpointToControllerMap: Record<
  Endpoints,
  (event: Event, ...args: any[]) => unknown
> = {
  [Endpoints.GET_TASKS]: controllers.getTasks,
  [Endpoints.GET_MY_TASKS]: controllers.getMyTasks,
  [Endpoints.GET_AVAILABLE_TASKS]: controllers.getAvailableTasks,
  [Endpoints.GET_TASK_SOURCE]: controllers.getTaskSource,
  [Endpoints.GET_TASK_METADATA]: controllers.getTaskMetadata,
  [Endpoints.DELEGATE_STAKE]: controllers.delegateStake,
  [Endpoints.GET_TASK_INFO]: controllers.getTaskInfo,
  [Endpoints.START_TASK]: controllers.startTask,
  [Endpoints.STOP_TASK]: controllers.stopTask,
  [Endpoints.GET_EARNED_REWARD_BY_NODE]: controllers.getEarnedRewardByNode,
  [Endpoints.CHECK_WALLET_EXISTS]: controllers.checkWalletExists,
  [Endpoints.GET_MAIN_ACCOUNT_PUBKEY]: controllers.getMainAccountPubKey,
  [Endpoints.GET_TASK_LOGS]: controllers.getTaskLogs,
  [Endpoints.GET_STAKING_ACCOUNT_PUBKEY]: controllers.getStakingAccountPubKey,
  [Endpoints.CLAIM_REWARD]: controllers.claimReward,
  [Endpoints.CREATE_NODE_WALLETS]: controllers.createNodeWallets,
  [Endpoints.GENERATE_SEED_PHRASE]: controllers.generateSeedPhrase,
  [Endpoints.SET_ACTIVE_ACCOUNT]: controllers.setActiveAccount,
  [Endpoints.GET_ALL_ACCOUNTS]: controllers.getAllAccounts,
  [Endpoints.STORE_USER_CONFIG]: controllers.storeUserConfig,
  [Endpoints.GET_USER_CONFIG]: controllers.getUserConfig,
  [Endpoints.GET_TASKS_BY_ID]: controllers.getTasksById,
  [Endpoints.REMOVE_ACCOUNT_BY_NAME]: controllers.removeAccountByName,
  [Endpoints.OPEN_BROWSER_WINDOW]: controllers.openBrowserWindow,
  [Endpoints.GET_TASK_NODE_INFO]: controllers.getTaskNodeInfo,
  [Endpoints.WITHDRAW_STAKE]: controllers.withdrawStake,
  [Endpoints.GET_TASK_VARIABLES_NAMES]: controllers.getTaskVariablesNames,
  [Endpoints.GET_STORED_TASK_VARIABLES]: controllers.getStoredTaskVariables,
  [Endpoints.STORE_TASK_VARIABLE]: controllers.storeTaskVariable,
  [Endpoints.DELETE_TASK_VARIABLE]: controllers.deleteTaskVariable,
  [Endpoints.EDIT_TASK_VARIABLE]: controllers.editTaskVariable,
  [Endpoints.PAIR_TASK_VARIABLE]: controllers.pairTaskVariable,
  [Endpoints.UNPAIR_TASK_VARIABLE]: controllers.unpairTaskVariable,
  [Endpoints.GET_TASKS_PAIRED_WITH_VARIABLE]:
    controllers.getTasksPairedWithVariable,
  [Endpoints.GET_STORED_PAIRED_TASK_VARIABLES]:
    controllers.getStoredPairedTaskVariables,
  [Endpoints.GET_ACCOUNT_BALANCE]: controllers.getAccountBalance,
  [Endpoints.SWITCH_NETWORK]: controllers.switchNetwork,
  [Endpoints.GET_NETWORK_URL]: controllers.getNetworkUrl,
};

const initHandlers = (): void => {
  Object.entries(endpointToControllerMap).forEach(
    ([endpointKey, controller]) => {
      ipcMain.handle(endpointKey, mainErrorHandler(controller));
    }
  );
};

// export const resetHandlers = (): void => {
//   Object.entries(endpointToControllerMap).forEach(
//     ([endpointKey, controller]) => {
//       ipcMain.removeHandler(endpointKey);
//       ipcMain.handle(endpointKey, mainErrorHandler(controller));
//     }
//   );
// };

export default errorHandler(initHandlers, 'Init handlers error');
