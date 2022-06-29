import config from 'config';
import sendMessage from 'preload/sendMessage';

export default (): Promise<unknown> =>
  sendMessage(config.endpoints.CHECK_WALLET_EXISTS, {});
