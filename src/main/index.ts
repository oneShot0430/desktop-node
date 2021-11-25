import { ipcMain } from 'electron';

import controllers from './controllers';

ipcMain.handle('getTasks', controllers.getTasks);
