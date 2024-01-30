import {
  app,
  BrowserWindow,
  dialog,
  globalShortcut,
  Menu,
  MenuItemConstructorOptions,
  shell,
  Tray,
} from 'electron';
import path from 'path';

import { get } from 'lodash';

import { initializeAppUpdater } from './AppUpdater';
import {
  getAllAccounts,
  setActiveAccount,
  getUserConfig,
  stopOrcaVM,
} from './controllers';
import initHandlers from './initHandlers';
import { configureLogger } from './logger';
import { getCurrentActiveAccountName } from './node/helpers';
import { setUpPowerStateManagement } from './powerMonitor';
import { resolveHtmlPath } from './util';

const isMac = process.platform === 'darwin';
let tray: Tray | null = null;

// Define the flag
// let (app as any).isQuitting = false;

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
  // const userConfig = await getUserConfig();
  // const shouldSetNetworkToDefault = !userConfig?.onboardingCompleted;
  initHandlers();

  await getCurrentActiveAccountName().catch(async () => {
    console.warn(
      'NO ACTIVE ACCOUNT IN DB - setting first available account as active'
    );
    const allAccounts = await getAllAccounts({} as Event);

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
    width: 1920,
    height: 1080,
    minWidth: 1152,
    minHeight: 870,

    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  app.on('before-quit', () => {
    // Run your tasks or code here before quitting
    console.log('Running tasks before quitting');
    try {
      stopOrcaVM().then(console.log);
    } catch (error) {
      console.error(error);
    }
  });
  // Open the DevTools.
  // mainWindow.webContents.setDevToolsWebContents(
  //   new BrowserWindow().webContents
  // );
  // mainWindow.webContents.openDevTools({ mode: 'detach' });
  const userConfig = await getUserConfig();
  const limitLogsSize = get(userConfig, 'limitLogsSize', false);

  configureLogger(limitLogsSize);
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

  const ret = globalShortcut.register('CommandOrControl+Q', () => {
    (app as any).isQuitting = true;
    app.quit();
  });

  if (!ret) {
    console.log('Registration failed');
  }

  // Check whether a shortcut is registered.
  console.log(globalShortcut.isRegistered('CommandOrControl+Q'));

  // Add event listener for 'close' event
  mainWindow.on('close', (event) => {
    console.log('#### is Quitting', (app as any).isQuitting);
    if (!isDebug && !(app as any).isQuitting) {
      event.preventDefault(); // Prevent the default close operation
      if (mainWindow) {
        if (isMac) {
          mainWindow.minimize();
        } else {
          mainWindow.hide();
        }
      }
      // Minimize the window instead of closing
    }
  });
};

const createMenu = () => {
  const template = [
    ...(process.platform === 'darwin'
      ? ([
          {
            label: app.getName(),
            submenu: [
              {
                label: 'FAQ',
                click: () => {
                  shell.openExternal('https://docs.koii.network/koii/faq');
                },
              },
              {
                label: 'Report an issue',
                click: () => {
                  shell.openExternal('https://discord.gg/koii-network');
                },
              },
              {
                label: 'Hide',
                accelerator: 'CmdOrCtrl+H',
                click: () => {
                  app.quit();
                },
              },
              {
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                click: () => {
                  (app as any).isQuitting = true;
                  app.quit();
                },
              },
            ],
          },
          {
            label: 'Edit',
            submenu: [
              { label: 'Undo', role: 'undo' },
              { label: 'Redo', role: 'redo' },
              { type: 'separator' },
              { label: 'Cut', role: 'cut' },
              { label: 'Copy', role: 'copy' },
              { label: 'Paste', role: 'paste' },
              { type: 'separator' },
              // eslint-disable-next-line @cspell/spellchecker
              { label: 'Select All', role: 'selectall' },
            ],
          },
        ] as MenuItemConstructorOptions[])
      : []),
    {
      label: 'Window',
      submenu: [
        {
          label: 'Hide',
          accelerator: 'CmdOrCtrl+H',
          click: () => {
            app.quit();
          },
        },
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            (app as any).isQuitting = true;
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'FAQ',
          click: () => {
            shell.openExternal('https://docs.koii.network/koii/faq');
          },
        },
        {
          label: 'Report an issue',
          click: () => {
            shell.openExternal('https://discord.gg/koii-network');
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

function createTray() {
  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };
  const iconPath = getAssetPath('icons/trayIcon.png');
  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open',
      click: () => {
        if (mainWindow) mainWindow.show();
      },
    },
    {
      label: 'Quit',
      click: () => {
        (app as any).isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setToolTip('Koii Node');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    if (tray) tray.popUpContextMenu();
  });
  tray.on('double-click', () => {
    if (mainWindow) mainWindow.show();
  });
}

// Check for a single instance
const isSingleInstance = app.requestSingleInstanceLock();

if (!isSingleInstance) {
  // Another instance is already running, so quit
  app.quit();
} else {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', () => {
    createWindow();
    createMenu();
    createTray();
  });

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
      createMenu();
      createTray();
    }
  });

  app.on('will-quit', () => {
    // Unregister the shortcut.
    globalShortcut.unregister('CommandOrControl+Q');

    // Unregister all shortcuts if you have more.
    globalShortcut.unregisterAll();
  });

  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and import them here.
}
