import config from 'config';
import { TaskData } from 'models';

import sendMessage from '../sendMessage';

interface rewardWalletPayload {
  available_balances: TaskData['availableBalances'];
}

export default (payload: rewardWalletPayload): Promise<number> =>
  sendMessage(config.endpoints.GET_EARNED_REWARD_BY_NODE, payload);
