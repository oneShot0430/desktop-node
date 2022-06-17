import config from 'config';
import sendMessage from 'preload/sendMessage';
import { Task } from 'preload/type/tasks';

interface GetTaskInfoParam {
  taskStatePublicKey: string;
}

export default (payload: GetTaskInfoParam): Promise<Task> =>
  sendMessage(config.endpoints.GET_TASK_INFO, payload);
