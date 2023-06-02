/* eslint-disable class-methods-use-this */
import { BrowserWindow } from 'electron';

import log from 'electron-log';
import { autoUpdater } from 'electron-updater';

import { RendererEndpoints } from 'config/endpoints';

import { getUserConfig } from './controllers';

const CHECK_INTERVAL = 6 * 1000 * 60 * 60;

export class AppUpdater {
  public interval: NodeJS.Timer | null = null;

  constructor() {
    autoUpdater.logger = log;
    autoUpdater.autoDownload = false;
    // Get the user configuration
    this.createCheckForTheUpdatesInterval();

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
      getUserConfig()
        .then((appConfig) => {
          if (appConfig?.autoUpdatesEnabled) {
            autoUpdater.quitAndInstall();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  createCheckForTheUpdatesInterval() {
    if (!this.interval) {
      this.interval = setInterval(() => {
        autoUpdater.checkForUpdates();
      }, CHECK_INTERVAL);
    }
  }
}
