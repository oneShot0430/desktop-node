import { BrowserWindow, dialog } from 'electron';

import log from 'electron-log';
import { autoUpdater } from 'electron-updater';

import { RendererEndpoints } from 'config/endpoints';

import { getUserConfig } from './controllers';

const CHECK_INTERVAL = 6 * 1000 * 60 * 60;

let interval: NodeJS.Timer | null = null;

export async function initializeAppUpdater(
  mainWindow: BrowserWindow | undefined
) {
  await configureUpdater();
  createCheckForTheUpdatesInterval();
  setListeners(mainWindow);
}

async function configureUpdater() {
  autoUpdater.logger = log;
  autoUpdater.autoDownload = false;

  const userConfig = await getUserConfig();
  autoUpdater.channel = userConfig?.alphaUpdatesEnabled ? 'alpha' : 'latest';
}

function setListeners(mainWindow: BrowserWindow | undefined) {
  autoUpdater.on('update-available', (info) => {
    console.log('############# Main Process Update available', info);
    getUserConfig()
      .then((appConfig) => {
        // const mainWindow = BrowserWindow.getFocusedWindow();
        if (!appConfig?.autoUpdatesDisabled) {
          // If autoUpdatesDisabled is not set, autoupdates are enabled
          // if auto updates are enabled, download the update
          autoUpdater.downloadUpdate();
        } else if (mainWindow) {
          // if auto updates are disabled, inform the user about the update
          mainWindow.webContents.send(RendererEndpoints.UPDATE_AVAILABLE);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });

  autoUpdater.on('update-downloaded', (info) => {
    console.log('Update downloaded');
    console.log(info);

    getUserConfig()
      .then((appConfig) => {
        if (appConfig?.autoUpdatesDisabled) {
          mainWindow?.webContents.send(RendererEndpoints.UPDATE_DOWNLOADED);
        }
      })
      .catch((error) => {
        console.log(error);
      });

    setTimeout(() => {
      dialog
        .showMessageBox({
          type: 'question',
          buttons: ['Restart & Update', 'Update Later'],
          defaultId: 0,
          message:
            'Get the latest update. Do you want to restart and update now?',
        })
        // eslint-disable-next-line promise/no-nesting
        .then((selection) => {
          if (selection.response === 0) {
            // User clicked 'Restart & Update'
            autoUpdater.quitAndInstall();
          }
        });
    }, 2000);
  });
}

function createCheckForTheUpdatesInterval() {
  if (!interval) {
    interval = setInterval(() => {
      autoUpdater.checkForUpdates();
    }, CHECK_INTERVAL);
  }

  // runs the first check 25sec after the app initialization
  setTimeout(() => {
    autoUpdater.checkForUpdates();
  }, 25000);
}
