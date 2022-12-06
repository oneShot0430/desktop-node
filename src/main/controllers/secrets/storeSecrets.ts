import { Event } from 'electron';

import { namespaceInstance } from 'main/node/helpers/Namespace';
import { UserSecretsParamsType } from 'models/api/storeSecrets';
import { mainErrorHandler } from 'utils';

import { PersistentStoreKeys } from '../types';

export const storeSecrets = async (
  _event: Event,
  payload: UserSecretsParamsType
): Promise<UserSecretsParamsType> => {
  const { settings } = payload;

  const result = await namespaceInstance.storeSet<UserSecretsParamsType>(
    PersistentStoreKeys.UserSecrets,
    JSON.stringify(settings)
  );
  return result;
};

export default mainErrorHandler(storeSecrets);
