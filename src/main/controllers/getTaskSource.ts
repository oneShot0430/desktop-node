import { Event } from 'electron';

import { PublicKey } from '@_koi/web3.js';
import axios from 'axios';

import config from 'config';
import { ErrorType } from 'models';
import sdk from 'services/sdk';
import { DetailedError } from 'utils';

import mainErrorHandler from '../../utils/mainErrorHandler';

interface GetTaskSourceParam {
  taskAccountPubKey: string;
}

const getTaskSource = async (
  event: Event,
  payload: GetTaskSourceParam
): Promise<string> => {
  const { taskAccountPubKey } = payload;

  let accountInfo;
  try {
    accountInfo = await sdk.k2Connection.getAccountInfo(
      new PublicKey(taskAccountPubKey)
    );
  } catch (e) {
    throw new DetailedError({
      detailed: e,
      summary: "Hmm... We can't find this Task, try a different one.",
      type: ErrorType.TASK_NOT_FOUND,
    });
  }
  const taskData = JSON.parse(accountInfo.data.toString());

  // before opening PR: verify with Syed whether this is necessary
  if (!taskData) {
    throw new DetailedError({
      detailed: "Task doesn't exist",
      summary: "Hmm... We can't find this Task, try a different one.",
      type: ErrorType.TASK_NOT_FOUND,
    });
  }

  const url = `${config.node.GATEWAY_URL}/${taskData.task_audit_program}`;

  try {
    const { data: src } = await axios.get(url);
    return src;
  } catch (e) {
    console.error(e);
    throw new DetailedError({
      detailed: e,
      summary:
        'There was an error collecting the Task information from Arweave. Try again or let us know about the issue.',
      type: ErrorType.NO_TASK_SOURCECODE,
    });
  }
};

export default mainErrorHandler(getTaskSource);
