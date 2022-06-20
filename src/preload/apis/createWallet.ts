import config from 'config';
import sendMessage from 'preload/sendMessage';
import { Task } from 'preload/type/tasks';

// eslint-disable-next-line @typescript-eslint/ban-types
interface createWalletPayload {
  walletName: string;
}
export default (payload: createWalletPayload): Promise<string> =>
  sendMessage(config.endpoints.CREATE_WALLET, payload);
