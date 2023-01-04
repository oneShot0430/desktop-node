import config from 'config';
import { TaskVariableData } from 'models';
import sendMessage from 'preload/sendMessage';

export const editTaskVariable = (payload: TaskVariableData): Promise<void> =>
  sendMessage(config.endpoints.EDIT_TASK_VARIABLE, payload);
