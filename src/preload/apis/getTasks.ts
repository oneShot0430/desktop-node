import config from 'config';
import sendMessage from 'preload/sendMessage';
import { Task } from 'preload/type/tasks';

export default (payload: any): Promise<Task> => sendMessage(config.endpoints.GET_TASKS, payload);
