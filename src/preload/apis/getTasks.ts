import sendMessage from 'preload/sendMessage';
import { Task } from 'preload/type/tasks';

export default (payload: any): Promise<Task> => sendMessage('getTasks', payload);
