import { BrowserWindow, dialog } from 'electron';

import log from 'electron-log';
import { autoUpdater } from 'electron-updater';

import { RendererEndpoints } from 'config/endpoints';

import { getUserConfig } from './controllers';

const CHECK_INTERVAL = 6 * 1000 * 60 * 60;

export async function initializeAppUpdater() {
  await configureUpdater();
  createCheckForTheUpdatesInterval();
  setListeners();
}

async function configureUpdater() {
  autoUpdater.logger = log;
  autoUpdater.autoDownload = false;

  const userConfig = await getUserConfig();
  autoUpdater.channel = userConfig?.alphaUpdatesEnabled ? 'alpha' : 'latest';
}

function setListeners() {
  autoUpdater.on('update-available', () => {
    getUserConfig()
      .then((appConfig) => {
        const mainWindow = BrowserWindow.getFocusedWindow();
        if (appConfig?.autoUpdatesEnabled) {
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
    // Check for the user configuration again before deciding to install
    getUserConfig().then((appConfig) => {
      if (appConfig?.autoUpdatesEnabled) {
        dialog
          .showMessageBox({
            type: 'question',
            buttons: ['Restart & Update', 'Update Later'],
            defaultId: 0,
            message:
              'Get the latest update. Do you want to restart and update now?',
          })
          .then((selection) => {
            if (selection.response === 0) {
              // User clicked 'Restart & Update'
              autoUpdater.quitAndInstall();
            }
          });
      }
    });
  });
}

let interval: NodeJS.Timer | null = null;

function createCheckForTheUpdatesInterval() {
  if (!interval) {
    interval = setInterval(() => {
      autoUpdater.checkForUpdates();
    }, CHECK_INTERVAL);
  }
}
