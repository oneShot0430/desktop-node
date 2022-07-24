import { Event } from 'electron';
import fs from 'fs';

import { Task } from 'models';
import { GetAvailableTasksParam } from 'models/api';
import koiiTasks from 'services/koiiTasks';

import mainErrorHandler from '../../utils/mainErrorHandler';

const getAvailableTasks = (
  event: Event,
  payload: GetAvailableTasksParam
): Task[] => {
  const { offset, limit } = payload;
  const tasks = koiiTasks.getAllTasks();
  const files = fs.readdirSync('namespace', { withFileTypes: true });
  const directoriesInDIrectory = files
    .filter((item) => item.isDirectory())
    .map((item) => item.name);

  return tasks
    .filter((e) => !directoriesInDIrectory.includes(e.publicKey))
    .slice(offset, offset + limit);
};

export default mainErrorHandler(getAvailableTasks);
