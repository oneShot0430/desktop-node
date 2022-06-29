import config from 'config';
import { GetTaskLogsParam } from 'models';
import sendMessage from 'preload/sendMessage';
import { TaskData } from 'preload/type/tasks';

export default (payload: GetTaskLogsParam): Promise<TaskData> =>
  sendMessage(config.endpoints.GET_TASK_LOGS, payload);
