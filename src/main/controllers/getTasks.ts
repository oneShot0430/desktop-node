import { Event } from 'electron';

import { Task } from 'models';
import koiiTasks from 'services/koiiTasks';

import mainErrorHandler from '../../utils/mainErrorHandler';

const getTasks = (event: Event, payload: any): Task[] =>
  koiiTasks.getAllTasks();

export default mainErrorHandler(getTasks);
