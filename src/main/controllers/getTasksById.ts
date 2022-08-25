import { Event } from 'electron';

import { Task } from 'models';
import { GetTasksByIdParam } from 'models/api';
import koiiTasks from 'services/koiiTasks';

import mainErrorHandler from '../../utils/mainErrorHandler';

const getTasksById = (event: Event, payload: GetTasksByIdParam): Task[] => {
  const { tasksIds } = payload || {};
  const response = tasksIds.map((e) => koiiTasks.getTaskByPublicKey(e));
  return response;
};

export default mainErrorHandler(getTasksById);
