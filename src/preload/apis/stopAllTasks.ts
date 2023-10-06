import config from 'config';
import sendMessage from 'preload/sendMessage';

export default (/* payload?: StartStopAllTasksParams */) =>
  sendMessage(config.endpoints.STOP_ALL_TASKS, {});
