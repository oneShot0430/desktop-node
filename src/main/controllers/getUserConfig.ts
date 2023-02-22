import { getUserConfigResponse } from '../../models/api';
import mainErrorHandler from '../../utils/mainErrorHandler';
import { namespaceInstance } from '../node/helpers/Namespace';

const USER_CONFIG = 'USER_CONFIG';

const getUserConfig = async (): Promise<getUserConfigResponse> => {
  try {
    const userConfig = await namespaceInstance.storeGet(USER_CONFIG);
    return JSON.parse(userConfig as string);
  } catch (err) {
    console.log('ERROR', err);
    throw err;
  }
};

export default mainErrorHandler(getUserConfig);
