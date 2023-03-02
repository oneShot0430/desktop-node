import { Event } from 'electron';

import { GetTaskSourceParam } from 'models';

import { fetchFromIPFSOrArweave } from './fetchFromIPFSOrArweave';
import { getTaskInfo } from './getTaskInfo';

export const getTaskSource = async (
  _: Event,
  payload: GetTaskSourceParam
): Promise<string> => {
  const taskData = await getTaskInfo({} as Event, payload, 'getTaskSource');
  const sourceCode = fetchFromIPFSOrArweave<string>(
    taskData.taskAuditProgram,
    'main.js'
  );

  return sourceCode;
};
