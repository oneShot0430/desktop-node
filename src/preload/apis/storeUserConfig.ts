import config from '../../config';
import { StoreUserConfigParam } from '../../models/api';
import sendMessage from '../sendMessage';

export default (payload: StoreUserConfigParam): Promise<boolean> =>
  sendMessage(config.endpoints.STORE_USER_CONFIG, payload);
