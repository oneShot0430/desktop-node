import { Event } from 'electron';

import koiiTasks from 'main/services/koiiTasks';
import { Task } from 'models';
import { GetTasksByIdParam } from 'models/api';

export const getTasksById = (
  event: Event,
  payload: GetTasksByIdParam
): Task[] => {
  const { tasksIds } = payload || {};
  const response = tasksIds
    .map((e) => koiiTasks.getTaskByPublicKey(e))
    .filter((e): e is Task => Boolean(e));
  return response;
};
