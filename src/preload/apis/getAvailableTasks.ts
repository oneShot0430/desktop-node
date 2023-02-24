import config from 'config';
import { Task, GetAvailableTasksParam } from 'models';

import sendMessage from '../sendMessage';

export default (params: GetAvailableTasksParam): Promise<Task[]> =>
  sendMessage(config.endpoints.GET_AVAILABLE_TASKS, params);
