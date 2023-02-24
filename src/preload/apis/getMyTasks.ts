import config from 'config';
import { Task, GetMyTasksParam } from 'models';

import sendMessage from '../sendMessage';

export default (params: GetMyTasksParam): Promise<Task[]> =>
  sendMessage(config.endpoints.GET_MY_TASKS, params);
