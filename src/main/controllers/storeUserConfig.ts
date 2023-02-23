import { Event } from 'electron';

import { StoreUserConfigParam } from '../../models/api';
import mainErrorHandler from '../../utils/mainErrorHandler';
import { namespaceInstance } from '../node/helpers/Namespace';

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

export default mainErrorHandler(storeUserConfig);
