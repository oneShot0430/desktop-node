import { StoreUserConfigParam } from 'models';

import config from '../../config';
import sendMessage from '../sendMessage';

export default (payload: StoreUserConfigParam): Promise<boolean> =>
  sendMessage(config.endpoints.STORE_USER_CONFIG, payload);
