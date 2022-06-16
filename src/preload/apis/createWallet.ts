import config from 'config';
import sendMessage from 'preload/sendMessage';
import { Task } from 'preload/type/tasks';

// eslint-disable-next-line @typescript-eslint/ban-types
type creatWalletPayload = {};

export default (payload: creatWalletPayload): Promise<Task> =>
  sendMessage(config.endpoints.CREATE_WALLET, payload);
