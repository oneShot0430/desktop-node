import { Event } from 'electron';
import * as fsSync from 'fs';

import { getAppDataPath } from 'main/node/helpers/getAppDataPath';
import koiiTasks from 'main/services/koiiTasks';
import { PaginatedResponse, Task } from 'models';
import { GetMyTasksParam } from 'models/api';
import { checkErrorInLastLogTimestamp } from 'utils';

import { parseRawK2TaskData } from '../node/helpers/parseRawK2TaskData';

const getMyTasks = async (
  event: Event,
  payload: GetMyTasksParam
): Promise<PaginatedResponse<Task>> => {
  console.log('GETTING MY TASKS');
  const { offset, limit } = payload;
  const startedTasks = koiiTasks.getStartedTasks();

  const slicedTasks = startedTasks
    .slice(offset, offset + limit)
    .map((rawTaskData) => {
      const taskLogPath = `${getAppDataPath()}/namespace/${
        rawTaskData.task_id
      }/task.log`;
      const taskLogs = fsSync.readFileSync(taskLogPath, 'utf-8');
      const hasError = checkErrorInLastLogTimestamp(taskLogs);

      return {
        publicKey: rawTaskData.task_id,
        data: parseRawK2TaskData({ rawTaskData, isRunning: true, hasError }),
      };
    });

  const response: PaginatedResponse<Task> = {
    content: slicedTasks,
    hasNext: slicedTasks.length === limit,
    itemsCount: startedTasks.length,
  };
  return response;
};

export default getMyTasks;
