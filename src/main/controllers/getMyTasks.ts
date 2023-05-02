import { Event } from 'electron';
import * as fsSync from 'fs';

import { getAppDataPath } from 'main/node/helpers/getAppDataPath';
import koiiTasks from 'main/services/koiiTasks';
import { PaginatedResponse, Task } from 'models';
import { GetMyTasksParam } from 'models/api';

import { parseRawK2TaskData } from '../node/helpers/parseRawK2TaskData';

const getMyTasks = async (
  event: Event,
  payload: GetMyTasksParam
): Promise<PaginatedResponse<Task>> => {
  console.log('GETTING MY TASKS');
  const { offset, limit } = payload;
  const tasks = koiiTasks.runningTasksData;
  console.log('MY TASKS', tasks);

  const slicedTasks = tasks.slice(offset, offset + limit).map((rawTaskData) => {
    const taskLogPath = `${getAppDataPath()}/namespace/${
      rawTaskData.task_id
    }/task.log`;
    const taskLog = fsSync.readFileSync(taskLogPath, 'utf-8');
    const hasError = taskLog.includes('error');

    return {
      publicKey: rawTaskData.task_id,
      data: parseRawK2TaskData({ rawTaskData, isRunning: true, hasError }),
    };
  });

  const response: PaginatedResponse<Task> = {
    content: slicedTasks,
    hasNext: slicedTasks.length === limit,
    itemsCount: koiiTasks.runningTasksData.length,
  };
  return response;
};

export default getMyTasks;
