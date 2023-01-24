import { Event } from 'electron';
import fs from 'fs';

import { Task } from 'models';
import { GetMyTasksParam } from 'models/api';
import koiiTasks from 'services/koiiTasks';

import { getAppDataPath } from '../node/helpers/getAppDataPath';

const getMyTasks = (event: Event, payload: GetMyTasksParam): Task[] => {
  const { offset, limit } = payload;
  const tasks = koiiTasks.getAllTasks();
  const files = fs.readdirSync(getAppDataPath() + '/namespace', {
    withFileTypes: true,
  });
  const directoriesInDIrectory = files
    .filter((item) => item.isDirectory())
    .map((item) => item.name);

  return tasks
    .filter((e) => directoriesInDIrectory.includes(e.publicKey))
    .slice(offset, offset + limit);
};

export default getMyTasks;
