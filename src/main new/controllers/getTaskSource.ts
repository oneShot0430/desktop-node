import { Event } from 'electron';

import { PublicKey } from '@_koi/web3.js';
import axios from 'axios';

import config from 'config';
import { ErrorType } from 'models';
import sdk from 'services/sdk';
import { throwDetailedError } from 'utils';

import mainErrorHandler from '../../utils/mainErrorHandler';

interface GetTaskSourceParam {
  taskAccountPubKey: string;
}

const getTaskSource = async (
  event: Event,
  payload: GetTaskSourceParam
): Promise<string> => {
  const { taskAccountPubKey } = payload;

  const accountInfo = await sdk.k2Connection.getAccountInfo(
    new PublicKey(taskAccountPubKey)
  );

  if (!accountInfo || !accountInfo.data)
    return throwDetailedError({
      detailed: 'Task not found',
      type: ErrorType.TASK_NOT_FOUND,
    });

  const taskData = JSON.parse(accountInfo.data.toString());

  if (!taskData) {
    return throwDetailedError({
      detailed: 'Task not found',
      type: ErrorType.TASK_NOT_FOUND,
    });
  }

  const url = `${config.node.GATEWAY_URL}/${taskData.task_audit_program}`;

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

export default mainErrorHandler(getTaskSource);
