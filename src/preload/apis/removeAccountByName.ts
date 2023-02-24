import { RemoveAccountByNameParam } from 'models';

import config from '../../config';
import sendMessage from '../sendMessage';

export default (payload: RemoveAccountByNameParam): Promise<boolean> =>
  sendMessage(config.endpoints.REMOVE_ACCOUNT_BY_NAME, payload);
