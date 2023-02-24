import config from 'config';
import { getUserConfigResponse } from 'models';

import sendMessage from '../sendMessage';

export default (): Promise<getUserConfigResponse> =>
  sendMessage(config.endpoints.GET_USER_CONFIG, {});
