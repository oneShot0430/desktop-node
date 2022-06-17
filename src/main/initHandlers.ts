import { ipcMain } from 'electron';

import config from 'config';

import controllers from './controllers';
import errorHandler from './errorHandler';

const initHandlers = (): void => {
  ipcMain.handle(config.endpoints.GET_TASKS, controllers.getTasks);
  ipcMain.handle(config.endpoints.GET_TASK_SOURCE, controllers.getTaskSource);
  ipcMain.handle(config.endpoints.ADD_TASK, controllers.addTask);
  ipcMain.handle(config.endpoints.TOGGLE_TASK, controllers.toggleTask);
  ipcMain.handle(config.endpoints.DELEGATE_STAKE, controllers.delegateStake);
  ipcMain.handle(config.endpoints.GET_TASK_INFO, controllers.getTaskInfo);
};

export default errorHandler(initHandlers, 'Init handlers error');
