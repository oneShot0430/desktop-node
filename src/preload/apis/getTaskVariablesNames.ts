import config from 'config';
import { Task } from 'models';
import { GetTaskVariablesNamesParam } from 'models/api';
import sendMessage from 'preload/sendMessage';

export default (params: GetTaskVariablesNamesParam): Promise<Task[]> =>
  sendMessage(config.endpoints.GET_TASK_VARIABLES_NAMES, params);
