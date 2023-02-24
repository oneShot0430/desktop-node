import config from 'config';
import { Task, FetchAllTasksParam } from 'models';

import sendMessage from '../sendMessage';

export default (params: FetchAllTasksParam): Promise<Task[]> =>
  sendMessage(config.endpoints.GET_TASKS, params);
