import { SetActiveAccountParam } from 'models';

import config from '../../config';
import sendMessage from '../sendMessage';

export default (payload: SetActiveAccountParam): Promise<boolean> =>
  sendMessage(config.endpoints.SET_ACTIVE_ACCOUNT, payload);
