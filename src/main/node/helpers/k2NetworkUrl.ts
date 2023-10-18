import Store from 'electron-store';

import { DEFAULT_K2_NETWORK_URL } from 'config/node';

export const store = new Store<{
  k2URL: string;
  timeToNextRewardAsSlots: number;
}>();

export const initializeStore = async (shouldSetNetworkToDefault: boolean) => {
  const k2URL = store.get('k2URL');

  if (k2URL === undefined || shouldSetNetworkToDefault) {
    store.set('k2URL', DEFAULT_K2_NETWORK_URL);
  }
};

export const getK2NetworkUrl = () => {
  return store.get('k2URL');
};

export const setK2NetworkUrl = (url: string) => store.set('k2URL', url);
