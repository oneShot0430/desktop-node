import config from 'config';
import { SecretData } from 'models';
import sendMessage from 'preload/sendMessage';

export const storeSecret = (payload: SecretData): Promise<void> =>
  sendMessage(config.endpoints.STORE_SECRETS, payload);
