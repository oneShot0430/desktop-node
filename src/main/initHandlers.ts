import { ipcMain } from 'electron';

import config from 'config';

import controllers from './controllers';
import errorHandler from './errorHandler';

const initHandlers = (): void => {
  ipcMain.handle(config.endpoints.GET_TASKS, controllers.getTasks);
  ipcMain.handle(config.endpoints.GET_TASK_SOURCE, controllers.getTaskSource);
  ipcMain.handle(
    config.endpoints.CREATE_STAKING_WALLET,
    controllers.createStakingWallet
  );
  ipcMain.handle(config.endpoints.DELEGATE_STAKE, controllers.delegateStake);
  ipcMain.handle(config.endpoints.GET_TASK_INFO, controllers.getTaskInfo);
  ipcMain.handle(config.endpoints.START_TASK, controllers.startTask);
  ipcMain.handle(config.endpoints.STOP_TASK, controllers.stopTask);
  ipcMain.handle(
    config.endpoints.STORE_MAIN_WALLET,
    controllers.storeMainWallet
  );
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
};

export default errorHandler(initHandlers, 'Init handlers error');
