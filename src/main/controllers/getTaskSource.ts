import { Event } from 'electron';

import axios from 'axios';

import config from 'config';
import { ErrorType, GetTaskSourceParam } from 'models';
import { throwDetailedError } from 'utils';

import { getTaskInfo } from './getTaskInfo';

const getTaskSource = async (
  event: Event,
  payload: GetTaskSourceParam
): Promise<string> => {
  const taskData = await getTaskInfo(null, payload, 'getTaskSource');

  const url = `${config.node.GATEWAY_URL}/${taskData.taskAuditProgram}`;

  try {
    const { data: src } = await axios.get(url);
    return src;
  } catch (e) {
    console.error(e);
    return throwDetailedError({
      detailed: e,
      type: ErrorType.NO_TASK_SOURCECODE,
    });
  }
};

export default getTaskSource;
