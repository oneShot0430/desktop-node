import config from 'config';
import { Task } from 'models';
import sendMessage from 'preload/sendMessage';

export default (): Promise<Task[]> =>
  sendMessage(config.endpoints.GET_AVAILABLE_TASKS, {});
