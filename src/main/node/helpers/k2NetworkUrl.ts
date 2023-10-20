import Store from 'electron-store';

import { DEFAULT_K2_NETWORK_URL, TESTNET_RPC_URL } from 'config/node';

export const store = new Store<{
  k2URL: string;
  timeToNextRewardAsSlots: number;
}>();

export const initializeStore = async () => {
  const k2URL = store.get('k2URL');

  if (k2URL === undefined || k2URL === TESTNET_RPC_URL) {
    store.set('k2URL', DEFAULT_K2_NETWORK_URL);
  }
};

export const getK2NetworkUrl = () => {
  return store.get('k2URL');
};
initializeStore();

export const setK2NetworkUrl = (url: string) => store.set('k2URL', url);
