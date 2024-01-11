import { checkOrcaPodmanExistsAndRunningResponse } from 'models/api';

const { exec } = require('child_process');

export const checkOrcaPodmanExistsAndRunning =
  async (): Promise<checkOrcaPodmanExistsAndRunningResponse> => {
    let isPodmanExists = false;
    let isOrcaVMRunning = false;
    try {
      isPodmanExists = await checkIsPodmanExists();
      if (isPodmanExists) {
        isOrcaVMRunning = await checkIsOrcaVMRunning();
      }
      return { isPodmanExists, isOrcaVMRunning };
    } catch (error: any) {
      if (!error.message.includes('not found')) {
        console.error(error.message);
      }
      return { isPodmanExists, isOrcaVMRunning };
    }
  };

function checkIsPodmanExists(): Promise<boolean> {
  const command = 'podman --version';

  return new Promise((resolve, reject) => {
    exec(command, (error: Error) => {
      if (error) {
        // Podman is not installed or an error occurred
        reject(error);
      } else {
        // Podman is installed and the command executed successfully
        resolve(true);
      }
    });
  });
}

function checkIsOrcaVMRunning(): Promise<boolean> {
  const lsCommand = 'podman machine ls';

  return new Promise((resolve, reject) => {
    exec(lsCommand, (error: Error, stdout: string) => {
      if (error) {
        // Podman is not installed or an error occurred
        console.error(error);
        reject(error);
      } else {
        // Podman is installed and the command executed successfully
        const orcaText = 'orca';
        const runningText = 'Currently running';
        console.log(stdout);
        if (stdout.includes(orcaText)) {
          if (stdout.includes(runningText)) {
            console.log('Podman is running');
            resolve(true); // Found the specific text
          } else {
            resolve(false);
          }
        } else {
          // Incase the podman vm was never started before
          reject(new Error("Please run 'podman machine start orca' "));
        }
      }
    });
  });
}
