import config from 'config';
import { TaskData } from 'models';
import sendMessage from 'preload/sendMessage';

export default (payload: { task: TaskData }): Promise<number> =>
  sendMessage(config.endpoints.GET_LATEST_AVERAGE_TASK_REWARD, payload);
