import config from 'config';
import { StartStopAllTasksParams } from 'main/controllers';
import sendMessage from 'preload/sendMessage';

export default (payload?: StartStopAllTasksParams) =>
  sendMessage(config.endpoints.STOP_ALL_TASKS, payload);
