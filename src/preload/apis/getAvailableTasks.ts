import config from '../../config';
import { Task } from '../../models';
import { GetAvailableTasksParam } from '../../models/api';
import sendMessage from '../../preload/sendMessage';

export default (params: GetAvailableTasksParam): Promise<Task[]> =>
  sendMessage(config.endpoints.GET_AVAILABLE_TASKS, params);
