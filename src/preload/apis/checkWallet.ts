import config from 'config';
import sendMessage from 'preload/sendMessage';

interface checkWalletParam {
  taskId: string;
}

export default (payload: checkWalletParam): Promise<unknown> =>
  sendMessage(config.endpoints.CHECK_WALLET, payload);
