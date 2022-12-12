import { namespaceInstance } from 'main/node/helpers/Namespace';
import { UserSecretsReturnType } from 'models/api/secrets/getSecrets';

import { PersistentStoreKeys } from '../types';

export const getSecrets = async (): Promise<UserSecretsReturnType> => {
  const secrets = await namespaceInstance.storeGet<UserSecretsReturnType>(
    PersistentStoreKeys.UserSecrets
  );
  return secrets;
};
