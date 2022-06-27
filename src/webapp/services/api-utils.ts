import { Task } from 'main/type/TaskData';
import { Task as WebAppTask } from 'webapp/@type/task';

export const parseTask = ({ data, publicKey }: Task): WebAppTask => ({
  publicKey,
  ...data,
});
