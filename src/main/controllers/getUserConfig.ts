import { Event } from 'electron';

import { namespaceInstance } from 'main/node/helpers/Namespace';
import { getUserConfigResponse } from 'models/api';

import mainErrorHandler from '../../utils/mainErrorHandler';

const USER_CONFIG = 'USER_CONFIG';

const getUserConfig = async (
  event: Event,
  payload: any
): Promise<getUserConfigResponse> => {
  try {
    const userConfig = await namespaceInstance.storeGet(USER_CONFIG);
    return JSON.parse(userConfig);
  } catch (err) {
    console.log('ERROR', err);
    throw err;
  }
};

export default mainErrorHandler(getUserConfig);
