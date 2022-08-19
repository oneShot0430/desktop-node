import config from 'config';
import { getUserConfigResponse } from 'models/api';
import sendMessage from 'preload/sendMessage';

export default (): Promise<getUserConfigResponse> =>
  sendMessage(config.endpoints.STORE_USER_CONFIG, {});
