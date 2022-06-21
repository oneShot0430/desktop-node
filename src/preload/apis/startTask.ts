import config from 'config';
import sendMessage from 'preload/sendMessage';

interface GetTaskSourceParam {
  taskAccountPubKey: string;
}

export default (payload: GetTaskSourceParam): Promise<void> =>
  sendMessage(config.endpoints.START_TASK, payload);
