import Store from 'electron-store';

import { DEFAULT_K2_NETWORK_URL } from 'config/node';

export const store = new Store<{
  k2URL: string;
  timeToNextRewardAsSlots: number;
}>();

const initializeStore = () => {
  const k2URL = store.get('k2URL');

  if (k2URL === undefined) {
    store.set('k2URL', DEFAULT_K2_NETWORK_URL);
  }
};

initializeStore();

export const getK2NetworkUrl = () => store.get('k2URL');

export const setK2NetworkUrl = (url: string) => store.set('k2URL', url);
