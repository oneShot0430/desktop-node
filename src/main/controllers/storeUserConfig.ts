import { Event } from 'electron';

import { namespaceInstance } from 'main/node/helpers/Namespace';
import { StoreUserConfigParam } from 'models/api';

const USER_CONFIG = 'USER_CONFIG';

const storeUserConfig = async (
  event: Event,
  payload: StoreUserConfigParam
): Promise<boolean> => {
  const { settings } = payload;

  try {
    await namespaceInstance.storeSet(USER_CONFIG, JSON.stringify(settings));
    return true;
  } catch (err) {
    console.log('ERROR', err);
    throw err;
  }
};

export default storeUserConfig;
