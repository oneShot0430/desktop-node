import config from 'config';
import { PairedTaskVariables } from 'models';
import sendMessage from 'preload/sendMessage';

export const editTaskVariable = (payload: PairedTaskVariables): Promise<void> =>
  sendMessage(config.endpoints.GET_STORED_PAIRED_TASK_VARIABLES, payload);
