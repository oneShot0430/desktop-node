import { app, Event } from 'electron';

import { DEVNET_RPC_URL, EMERGENCY_TESTNET_RPC_URL } from 'config/node';
import {
  getK2NetworkUrl,
  setK2NetworkUrl,
} from 'main/node/helpers/k2NetworkUrl';

export const switchNetwork = async (_: Event, newNetworkRPCUrl?: string) => {
  const newNetwork =
    newNetworkRPCUrl ||
    (getK2NetworkUrl() === DEVNET_RPC_URL
      ? EMERGENCY_TESTNET_RPC_URL
      : DEVNET_RPC_URL);

  console.log('switch network to: ', newNetwork);
  setK2NetworkUrl(newNetwork);

  app.relaunch();
  app.quit();
};
