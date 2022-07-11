import config from 'config';
import { StoreMainWalletParam } from 'models/api';
import sendMessage from 'preload/sendMessage';

export default (payload: StoreMainWalletParam): Promise<boolean> =>
  sendMessage(config.endpoints.STORE_MAIN_WALLET, payload);
