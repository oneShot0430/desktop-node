import { ipcMain } from 'electron';


import config from 'config';

import controllers from './controllers';
import errorHandler from './errorHandler';

const initHandlers = (): void => {
  ipcMain.handle(config.endpoints.GET_TASKS, controllers.getTasks);
};

export default errorHandler(initHandlers, 'Init handlers error: ');
