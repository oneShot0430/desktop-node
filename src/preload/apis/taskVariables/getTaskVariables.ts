import config from 'config';
import { TaskVariablesReturnType } from 'models/api/taskVariables/getTaskVariables';
import sendMessage from 'preload/sendMessage';

export const getTaskVariables = (): Promise<TaskVariablesReturnType> =>
  sendMessage(config.endpoints.GET_TASK_VARIABLES, {});
