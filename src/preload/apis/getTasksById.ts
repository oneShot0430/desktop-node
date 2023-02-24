import config from 'config';
import { Task, GetTasksByIdParam } from 'models';

import sendMessage from '../sendMessage';

export default (params: GetTasksByIdParam): Promise<Task[]> =>
  sendMessage(config.endpoints.GET_TASKS_BY_ID, params);
