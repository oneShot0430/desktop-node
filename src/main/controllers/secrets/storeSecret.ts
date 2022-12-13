import { randomUUID } from 'crypto';
import { Event } from 'electron';

import { namespaceInstance } from 'main/node/helpers/Namespace';
import { ErrorType, SecretData } from 'models';
import { throwDetailedError } from 'utils';

import { PersistentStoreKeys } from '../types';

import { getSecrets } from './getSecrets';

export const storeSecret = async (
  _event: Event,
  payload: SecretData
): Promise<void> => {
  const secrets = (await getSecrets()) ?? {};
  // throw error if payload is not valid
  if (!payload || !payload.label || !payload.value) {
    throw throwDetailedError({
      detailed: 'Secrets payload is not valid',
      type: ErrorType.GENERIC,
    });
  }

  const labelExists = Object.values(secrets).some(
    (secret) => secret.label === payload.label
  );

  if (labelExists) {
    throw throwDetailedError({
      detailed: 'Secrets label already exists',
      type: ErrorType.GENERIC,
    });
  }
  const secretId = randomUUID();

  const newSecrets = {
    ...secrets,
    [secretId]: payload,
  };

  const strigifiedSecret = JSON.stringify(newSecrets);

  await namespaceInstance.storeSet(
    PersistentStoreKeys.UserSecrets,
    strigifiedSecret
  );
};
