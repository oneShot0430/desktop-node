import config from 'config';
import sendMessage from 'preload/sendMessage';

export const getStoredPairedTaskVariables = (): Promise<void> =>
  sendMessage(config.endpoints.GET_STORED_PAIRED_TASK_VARIABLES, null);
