import { Event } from 'electron';

import koiiTasks from 'main/services/koiiTasks';
import { Task } from 'models';
import { GetTasksByIdParam } from 'models/api';

import { parseRawK2TaskData } from '../node/helpers/parseRawK2TaskData';

export const getTasksById = async (
  event: Event,
  payload: GetTasksByIdParam
): Promise<Task[]> => {
  const { tasksIds } = payload || {};
  const response: Task[] = (
    await koiiTasks.fetchDataBundleAndValidateIfTasks(tasksIds)
  )
    .map((rawTaskData) => {
      if (!rawTaskData) {
        return null;
      }

      return {
        publicKey: rawTaskData.task_id,
        data: parseRawK2TaskData(rawTaskData),
      };
    })
    .filter((e): e is Task => Boolean(e));
  return response;
};
