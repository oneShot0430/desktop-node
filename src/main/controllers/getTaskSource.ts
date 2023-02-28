import { Event } from 'electron';

import * as isIPFS from 'is-ipfs';

import axios from 'axios';
import config from 'config';
import { ErrorType, GetTaskSourceParam } from 'models';
import { retrieveFromIPFS } from 'services/ipfs';
import { throwDetailedError } from 'utils';

import { getTaskInfo } from './getTaskInfo';

export const getTaskSource = async (
  event: Event,
  payload: GetTaskSourceParam
): Promise<string> => {
  const taskData = await getTaskInfo({} as Event, payload, 'getTaskSource');

  const isTaskDeployedToIPFS = isIPFS.cid(taskData.taskAuditProgram);
  const retrieveFromArweave = async (cid: string) =>
    (await axios.get<string>(`${config.node.ARWEAVE_GATEWAY_URL}/${cid}`))
      ?.data;

  try {
    const sourceCode = isTaskDeployedToIPFS
      ? await retrieveFromIPFS(taskData.taskAuditProgram)
      : await retrieveFromArweave(taskData.taskAuditProgram);

    return sourceCode;
  } catch (e: any) {
    console.error(e);
    return throwDetailedError({
      detailed: e,
      type: ErrorType.NO_TASK_SOURCECODE,
    });
  }
};
