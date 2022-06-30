import config from 'config';
import { GetTaskLogsParam } from 'models';
import sendMessage from 'preload/sendMessage';

export default (payload: GetTaskLogsParam): Promise<string> =>
  sendMessage(config.endpoints.GET_TASK_LOGS, payload);
