import { app, BrowserWindow, dialog } from 'electron';
import path from 'path';

import { initializeAppUpdater } from './AppUpdater';
import { getAllAccounts, setActiveAccount } from './controllers';
import initHandlers from './initHandlers';
import { configureLogger } from './logger';
import { getCurrentActiveAccountName } from './node/helpers';
import { setUpPowerStateManagement } from './powerMonitor';
import { resolveHtmlPath } from './util';

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line global-require
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  // eslint-disable-next-line global-require
  require('electron-debug')();
}

const installExtensions = async () => {
  // eslint-disable-next-line global-require
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const main = async (): Promise<void> => {
  initHandlers();

  await getCurrentActiveAccountName().catch(async () => {
    console.warn(
      'NO ACTIVE ACCOUNT IN DB - setting first available account as active'
    );
    const allAccounts = await getAllAccounts();

    if (allAccounts[0]) {
      await setActiveAccount({} as Event, {
        accountName: allAccounts[0].accountName,
      });
    }
  });
};

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  // Create the browser window.
  mainWindow = new BrowserWindow({
    show: false,
    height: 750,
    width: 1152,
    minHeight: 750,
    minWidth: 1152,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  // Open the DevTools.
  // mainWindow.webContents.setDevToolsWebContents(
  //   new BrowserWindow().webContents
  // );
  // mainWindow.webContents.openDevTools({ mode: 'detach' });

  configureLogger();
  await initializeAppUpdater(mainWindow);

  await setUpPowerStateManagement();

  await main()
    .then(async () => {
      mainWindow?.on('ready-to-show', async () => {
        if (!mainWindow) {
          throw new Error('"mainWindow" is not defined');
        }

        if (process.env.START_MINIMIZED) {
          mainWindow.minimize();
        } else {
          mainWindow.show();
        }
      });
    })
    .catch((err): void => {
      dialog.showErrorBox('Something went wrong!', err.message);

      app.quit();
    });

  mainWindow.on('closed', () => {
    mainWindow = null;
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
