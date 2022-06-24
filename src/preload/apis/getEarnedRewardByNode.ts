import config from 'config';
import sendMessage from 'preload/sendMessage';

interface rewardWalletPayload {
  available_balances: any;
  taskAccountPubKey: string;
}

export default (payload: rewardWalletPayload): Promise<unknown> =>
  sendMessage(config.endpoints.GET_EARNED_REWARD_BY_NODE, payload);
