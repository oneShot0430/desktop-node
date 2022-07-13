import { Event } from 'electron';
import fs from 'fs';

import { Task } from 'models';
import koiiTasks from 'services/koiiTasks';

import mainErrorHandler from '../../utils/mainErrorHandler';

const getTasks = (event: Event, payload: any): Task[] => {
  const tasks = koiiTasks.getAllTasks();
  const files = fs.readdirSync('namespace', { withFileTypes: true });
  const directoriesInDIrectory = files
    .filter((item) => item.isDirectory())
    .map((item) => item.name);

  return tasks.filter((e) => directoriesInDIrectory.includes(e.publicKey));
};

export default mainErrorHandler(getTasks);
