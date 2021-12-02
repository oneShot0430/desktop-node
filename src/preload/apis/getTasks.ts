import config from 'config';
import sendMessage from 'preload/sendMessage';
import { Task } from 'preload/type/tasks';

type GetTasksPayload = {

}

export default (payload: GetTasksPayload): Promise<Task> => 
  sendMessage(config.endpoints.GET_TASKS, payload);
