import config from 'config';
import sendMessage from 'preload/sendMessage';

interface storeWalletPayload {
  walletPath: string;
}

export default (payload: storeWalletPayload): Promise<boolean> =>
  sendMessage(config.endpoints.STORE_MAIN_WALLET, payload);
