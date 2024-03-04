import { Event } from 'electron';

import koiiTasks from 'main/services/koiiTasks';
import { ErrorType, GetTaskInfoParam, GetTaskInfoResponse } from 'models';
import { throwDetailedError } from 'utils/error';

import { parseRawK2TaskData } from '../node/helpers/parseRawK2TaskData';

export const getTaskInfo = async (
  _: Event,
  payload: GetTaskInfoParam,
  context?: string
): Promise<GetTaskInfoResponse> => {
  const { taskAccountPubKey } = payload;

  try {
    const partialRawTaskData = await koiiTasks.getTaskState(taskAccountPubKey);

    return parseRawK2TaskData({
      rawTaskData: {
        ...partialRawTaskData,
        task_id: taskAccountPubKey,
      },
    });
  } catch (e) {
    return throwDetailedError({
      detailed: `Error during Task parsing${
        context ? ` in context of ${context}` : ''
      }: ${e}`,
      type: ErrorType.TASK_NOT_FOUND,
    });
  }
};

export const validateTask = getTaskInfo;
