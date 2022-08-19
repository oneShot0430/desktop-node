import config from 'config';
import { storeUserConfigParam } from 'models/api';
import sendMessage from 'preload/sendMessage';

export default (payload: storeUserConfigParam): Promise<boolean> =>
  sendMessage(config.endpoints.STORE_USER_CONFIG, payload);
