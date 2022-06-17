import config from 'config';
import sendMessage from 'preload/sendMessage';

interface creatWalletPayload {
  walletName: string;
}

export default (payload: creatWalletPayload): Promise<string> =>
  sendMessage(config.endpoints.CREATE_WALLET, payload);
