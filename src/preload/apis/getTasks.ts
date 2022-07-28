import config from 'config';
import { Task } from 'models';
import { FetchAllTasksParam } from 'models/api';
import sendMessage from 'preload/sendMessage';

export default (params: FetchAllTasksParam): Promise<Task[]> =>
  sendMessage(config.endpoints.GET_TASKS, params);
