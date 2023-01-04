import { ipcMain } from 'electron';

import config from 'config';

import * as controllers from './controllers';
import errorHandler from './errorHandler';

const initHandlers = (): void => {
  ipcMain.handle(config.endpoints.GET_TASKS, controllers.getTasks);
  ipcMain.handle(config.endpoints.GET_MY_TASKS, controllers.getMyTasks);
  ipcMain.handle(
    config.endpoints.GET_AVAILABLE_TASKS,
    controllers.getAvailableTasks
  );

  ipcMain.handle(config.endpoints.GET_TASK_SOURCE, controllers.getTaskSource);
  ipcMain.handle(config.endpoints.DELEGATE_STAKE, controllers.delegateStake);
  ipcMain.handle(config.endpoints.GET_TASK_INFO, controllers.getTaskInfo);
  ipcMain.handle(config.endpoints.START_TASK, controllers.startTask);
  ipcMain.handle(config.endpoints.STOP_TASK, controllers.stopTask);
  ipcMain.handle(
    config.endpoints.GET_EARNED_REWARD_BY_NODE,
    controllers.getEarnedRewardByNode
  );
  ipcMain.handle(
    config.endpoints.CHECK_WALLET_EXISTS,
    controllers.checkWalletExists
  );
  ipcMain.handle(
    config.endpoints.GET_MAIN_ACCOUNT_PUBKEY,
    controllers.getMainAccountPubKey
  );
  ipcMain.handle(config.endpoints.GET_TASK_LOGS, controllers.getTaskLogs);
  ipcMain.handle(
    config.endpoints.GET_STAKING_ACCOUNT_PUBKEY,
    controllers.getStakingAccountPubKey
  );
  ipcMain.handle(config.endpoints.CLAIM_REWARD, controllers.claimReward);
  ipcMain.handle(
    config.endpoints.CREATE_NODE_WALLETS,
    controllers.createNodeWallets
  );
  ipcMain.handle(
    config.endpoints.GENERATE_SEED_PHRASE,
    controllers.generateSeedPhrase
  );
  ipcMain.handle(
    config.endpoints.SET_ACTIVE_ACCOUNT,
    controllers.setActiveAccount
  );
  ipcMain.handle(config.endpoints.GET_ALL_ACCOUNTS, controllers.getAllAccounts);
  ipcMain.handle(
    config.endpoints.STORE_USER_CONFIG,
    controllers.storeUserConfig
  );
  ipcMain.handle(config.endpoints.GET_USER_CONFIG, controllers.getUserConfig);
  ipcMain.handle(config.endpoints.GET_TASKS_BY_ID, controllers.getTasksById);
  ipcMain.handle(
    config.endpoints.REMOVE_ACCOUNT_BY_NAME,
    controllers.removeAccountByName
  );
  ipcMain.handle(
    config.endpoints.OPEN_BROWSER_WINDOW,
    controllers.openBrowserWindow
  );
  ipcMain.handle(
    config.endpoints.GET_TASK_NODE_INFO,
    controllers.getTaskNodeInfo
  );
  ipcMain.handle(config.endpoints.WITHDRAW_STAKE, controllers.withdrawStake);
  ipcMain.handle(
    config.endpoints.GET_TASK_VARIABLES_NAMES,
    controllers.getTaskVariablesNames
  );
  ipcMain.handle(
    config.endpoints.GET_STORED_TASK_VARIABLES,
    controllers.getStoredTaskVariables
  );
  ipcMain.handle(
    config.endpoints.STORE_TASK_VARIABLE,
    controllers.storeTaskVariable
  );
  ipcMain.handle(
    config.endpoints.DELETE_TASK_VARIABLE,
    controllers.deleteTaskVariable
  );
};

export default errorHandler(initHandlers, 'Init handlers error');
