import { app, Event } from 'electron';

import { DEVNET_RPC_URL, TESTNET_RPC_URL } from 'config/node';
import {
  getK2NetworkUrl,
  setK2NetworkUrl,
} from 'main/node/helpers/k2NetworkUrl';

export const switchNetwork = async (_: Event) => {
  const newNetwork =
    getK2NetworkUrl() === DEVNET_RPC_URL ? TESTNET_RPC_URL : DEVNET_RPC_URL;

  console.log('switch network to: ', newNetwork);

  setK2NetworkUrl(newNetwork);

  app.relaunch();
  app.quit();
};
