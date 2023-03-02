import { Event } from 'electron';

import { ErrorType, GetTaskSourceParam } from 'models';
import { throwDetailedError } from 'utils';

import { fetchFromIPFSOrArweave } from './fetchFromIPFSOrArweave';
import { getTaskInfo } from './getTaskInfo';

export const getTaskSource = async (
  _: Event,
  payload: GetTaskSourceParam
): Promise<string> => {
  try {
    const { taskAuditProgram } = await getTaskInfo(
      {} as Event,
      payload,
      'getTaskSource'
    );
    const sourceCode = fetchFromIPFSOrArweave<string>(
      taskAuditProgram,
      'main.js'
    );
    return sourceCode;
  } catch (e: any) {
    console.error(e);
    return throwDetailedError({
      detailed: e,
      type: ErrorType.NO_TASK_SOURCECODE,
    });
  }
};
