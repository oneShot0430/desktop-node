import { Event } from 'electron';

import axios from 'axios';
// eslint-disable-next-line
// @ts-ignore
import * as isIPFS from 'is-ipfs';

import config from 'config';
import { ErrorType, GetTaskSourceParam } from 'models';
import { throwDetailedError } from 'utils';

import { getTaskInfo } from './getTaskInfo';

export const getTaskSource = async (
  event: Event,
  payload: GetTaskSourceParam
): Promise<string> => {
  const taskData = await getTaskInfo({} as Event, payload, 'getTaskSource');

  const isTaskDeployedToIPFS = isIPFS.cid(taskData.taskAuditProgram);
  const url = isTaskDeployedToIPFS
    ? `${config.node.IPFS_GATEWAY_URL}/${taskData.taskAuditProgram}/main.js`
    : `${config.node.ARWEAVE_GATEWAY_URL}/${taskData.taskAuditProgram}`;

  try {
    const { data: src } = await axios.get<string>(url);
    return src;
  } catch (e: any) {
    console.error(e);
    return throwDetailedError({
      detailed: e,
      type: ErrorType.NO_TASK_SOURCECODE,
    });
  }
};
