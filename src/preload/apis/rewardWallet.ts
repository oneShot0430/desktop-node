import config from 'config';
import sendMessage from 'preload/sendMessage';

interface rewardWalletPayload {
  available_balances: any;
  taskAccountPubKey: string;
}

export default (payload: rewardWalletPayload): Promise<unknown> =>
  sendMessage(config.endpoints.REWARD_WALLET, payload);
