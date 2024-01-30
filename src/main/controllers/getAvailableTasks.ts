import { Event } from 'electron';

import axios from 'axios';

import { FAUCET_API_URL } from 'config/faucet';
import koiiTasks from 'main/services/koiiTasks';
import { ErrorType, PaginatedResponse, Task } from 'models';
import { GetAvailableTasksParam } from 'models/api';
import { throwDetailedError } from 'utils';

import { parseRawK2TaskData } from '../node/helpers/parseRawK2TaskData';

const getAvailableTasks = async (
  event: Event,
  payload: GetAvailableTasksParam
): Promise<PaginatedResponse<Task>> => {
  try {
    const { offset, limit } = payload;

    let whitelistedTasks: string[] = [];
    try {
      whitelistedTasks = (
        await axios.get(`${FAUCET_API_URL}/get-whitelisted-task-ids`)
      ).data.whitelistedTaskIds;
      console.log({ whitelistedTasks });
    } catch (error) {
      console.error(error);
    }
    const idsSlice = whitelistedTasks.slice(offset, offset + limit);
    const runningIds = koiiTasks
      .getStartedTasks()
      .map(({ task_id }) => task_id);

    const filteredIdsSlice = idsSlice.filter(
      (pubKey) =>
        !runningIds.includes(pubKey) && whitelistedTasks.includes(pubKey)
    );

    const tasks: Task[] = (
      await koiiTasks.fetchDataBundleAndValidateIfTasks(filteredIdsSlice)
    )
      .map((rawTaskData) => {
        if (!rawTaskData) {
          return null;
        }

        return {
          publicKey: rawTaskData.task_id,
          data: parseRawK2TaskData({ rawTaskData }),
        };
      })
      .filter(
        (task): task is Task =>
          task !== null && task.data.isWhitelisted && task.data.isActive
      );

    const response: PaginatedResponse<Task> = {
      content: tasks,
      hasNext: idsSlice.length === limit,
      itemsCount: koiiTasks.allTaskPubkeys.length,
    };

    return response;
  } catch (e: any) {
    if (e?.message !== 'Tasks not fetched yet') console.error(e);
    return throwDetailedError({
      detailed: e,
      type: ErrorType.GENERIC,
    });
  }
};

export default getAvailableTasks;
