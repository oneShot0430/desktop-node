// import { exec, spawn } from 'child_process';
import { Event, app } from 'electron';

// import node from 'main/node';
// import { reset } from 'main/node/helpers/Namespace';
// import { resetHandlers } from 'main/initHandlers';
// import { mainWindow, relaunchApp } from 'main/main';
// import node from 'main/node';
import {
  getK2NetworkUrl,
  setK2NetworkUrl,
} from 'main/node/helpers/k2NetworkUrl';

// import getUserConfig from './getUserConfig';
// import storeUserConfig from './storeUserConfig';

const switchNetwork = async (_: Event) => {
  const newNetwork =
    getK2NetworkUrl() === 'https://k2-devnet.koii.live'
      ? 'https://k2-testnet.koii.live'
      : 'https://k2-devnet.koii.live';

  console.log('switch network to: ', newNetwork);

  setK2NetworkUrl(newNetwork);
  // resetHandlers();

  // await node();
  // mainWindow?.reload();

  // await reset();
  // await node();

  // // Get the path to the Electron executable
  // const { execPath } = process;
  // // Get the path to the app's entry script
  // const scriptPath = process.argv[1];

  // // Close the current app
  // app.quit();

  // // Start a new instance of the app
  // exec(`"${execPath}" "${scriptPath}"`);
  // relaunchApp();
  app.relaunch();

  // setTimeout(() => {
  app.quit();
  // }, 1000);
  // main();
};

export default switchNetwork;
