import config from 'config';
import sendMessage from 'preload/sendMessage';

interface creatWalletPayload {
  taskId: string;
}

export default (payload: creatWalletPayload): Promise<string> =>
  sendMessage(config.endpoints.CREATE_STAKING_WALLET, payload);
