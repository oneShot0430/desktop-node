import config from 'config';
import sendMessage from 'preload/sendMessage';

import { TaskData } from '../type/tasks';

interface rewardWalletPayload {
  available_balances: TaskData['availableBalances'];
}

export default (payload: rewardWalletPayload): Promise<number> =>
  sendMessage(config.endpoints.GET_EARNED_REWARD_BY_NODE, payload);
