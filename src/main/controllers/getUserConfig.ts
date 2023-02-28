import { namespaceInstance } from 'main/node/helpers/Namespace';
import { getUserConfigResponse } from 'models/api';

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

export default getUserConfig;
