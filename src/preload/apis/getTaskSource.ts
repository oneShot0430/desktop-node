import config from 'config';
import sendMessage from 'preload/sendMessage';

interface GetTaskSourceParam {
  taskStatePublicKey: string;
}

export default (payload: GetTaskSourceParam): Promise<string> =>
  sendMessage(config.endpoints.GET_TASK_SOURCE, payload);
