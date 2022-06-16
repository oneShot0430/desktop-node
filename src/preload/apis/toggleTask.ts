import config from 'config';
import sendMessage from 'preload/sendMessage';
import { Task } from 'preload/type/tasks';

type ToggleTaskPayload = {
  contractId: string;
};

export default (payload: ToggleTaskPayload): Promise<Task> =>
  sendMessage(config.endpoints.TOGGLE_TASK, payload);
