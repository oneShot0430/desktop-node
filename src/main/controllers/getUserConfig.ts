import { namespaceInstance } from 'main/node/helpers/Namespace';
import { getUserConfigResponse } from 'models/api';

const USER_CONFIG = 'USER_CONFIG';

const getUserConfig = async (): Promise<getUserConfigResponse> => {
  try {
    const userConfigStringified: string = await namespaceInstance.storeGet(
      USER_CONFIG
    );
    const userConfig = JSON.parse(
      userConfigStringified
    ) as getUserConfigResponse;
    return userConfig;
  } catch (err) {
    console.log('ERROR', err);
    throw err;
  }
};

export default getUserConfig;
