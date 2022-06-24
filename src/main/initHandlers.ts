import { ipcMain } from 'electron';

import config from 'config';

import controllers from './controllers';
import errorHandler from './errorHandler';

const initHandlers = (): void => {
  ipcMain.handle(config.endpoints.GET_TASKS, controllers.getTasks);
  ipcMain.handle(config.endpoints.GET_TASK_SOURCE, controllers.getTaskSource);
  ipcMain.handle(config.endpoints.CREATE_WALLET, controllers.createWallet);
  ipcMain.handle(config.endpoints.DELEGATE_STAKE, controllers.delegateStake);
  ipcMain.handle(config.endpoints.GET_TASK_INFO, controllers.getTaskInfo);
  ipcMain.handle(config.endpoints.START_TASK, controllers.startTask);
  ipcMain.handle(config.endpoints.STOP_TASK, controllers.stopTask);
  ipcMain.handle(config.endpoints.STORE_WALLET, controllers.storeWallet);
  ipcMain.handle(config.endpoints.REWARD_WALLET, controllers.rewardWallet);
};

export default errorHandler(initHandlers, 'Init handlers error');
