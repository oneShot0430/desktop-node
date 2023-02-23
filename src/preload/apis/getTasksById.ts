import config from '../../config';
import { Task } from '../../models';
import { GetTasksByIdParam } from '../../models/api';
import sendMessage from '../sendMessage';

export default (params: GetTasksByIdParam): Promise<Task[]> =>
  sendMessage(config.endpoints.GET_TASKS_BY_ID, params);
