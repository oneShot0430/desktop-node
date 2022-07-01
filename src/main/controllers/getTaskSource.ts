import { Event } from 'electron';

import { PublicKey } from '@_koi/web3.js';
import axios from 'axios';

import config from 'config';
import sdk from 'services/sdk';

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
  if (!accountInfo || !accountInfo.data) throw new Error('Task not found');
  const taskData = JSON.parse(accountInfo.data.toString());
  if (!taskData) throw new Error('Task not found');

  const url = `${config.node.GATEWAY_URL}/${taskData.task_audit_program}`;

  try {
    const { data: src } = await axios.get(url);
    return src;
  } catch (err) {
    console.error(err);
    throw new Error('Get task source error');
  }
};

export default mainErrorHandler(getTaskSource);
