import config from 'config';
import { UserSecretsReturnType } from 'models/api/secrets/getSecrets';
import sendMessage from 'preload/sendMessage';

export const getSecrets = (): Promise<UserSecretsReturnType> =>
  sendMessage(config.endpoints.GET_SECRETS, {});
