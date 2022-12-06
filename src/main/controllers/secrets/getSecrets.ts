import { namespaceInstance } from 'main/node/helpers/Namespace';
import { UserSecretsReturnType } from 'models/api/getSecrets';
import { mainErrorHandler } from 'utils';

import { PersistentStoreKeys } from '../types';

export const getSecrets = async (): Promise<UserSecretsReturnType> => {
  const secrets = await namespaceInstance.storeGet(
    PersistentStoreKeys.UserSecrets
  );

  return JSON.parse(secrets) as UserSecretsReturnType;
};

export default mainErrorHandler(getSecrets);
