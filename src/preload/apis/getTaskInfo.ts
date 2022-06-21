import config from 'config';
import sendMessage from 'preload/sendMessage';
import { TaskData } from 'preload/type/tasks';

interface GetTaskInfoParam {
  taskAccountPubKey: string;
}

export default (payload: GetTaskInfoParam): Promise<TaskData> =>
  sendMessage(config.endpoints.GET_TASK_INFO, payload);
