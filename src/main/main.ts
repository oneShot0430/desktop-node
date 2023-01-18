import { app, BrowserWindow, dialog } from 'electron';
import path from 'path';

import initHandlers from './initHandlers';
import node from './node';
import { resolveHtmlPath } from './util';

const main = async (): Promise<void> => {
  initHandlers();
  await node();
};

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 720,
    width: 1152,
    minHeight: 720,
    minWidth: 1152,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
    show: false,
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  // Open the DevTools.
  mainWindow.webContents.setDevToolsWebContents(
    new BrowserWindow().webContents
  );
  mainWindow.webContents.openDevTools({ mode: 'detach' });

  main()
    .then((): void => {
      mainWindow.show();
    })
    .catch((err): void => {
      dialog.showErrorBox('Something went wrong!', err.message);

      app.quit();
    });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
