import { Event } from 'electron';

import axios from 'axios';

import config from 'config';
import koiiState from 'services/koiiState';

import mainErrorHandler from '../../utils/mainErrorHandler';

const getTaskSource = async (event: Event, payload: any): Promise<string> => {
  const { transactionId } = payload;
  const task = koiiState.findTask(transactionId);

  if (!task) throw new Error('Task not found');

  const url = `${config.node.GATEWAY_URL}/${task.executableId}`;
  
  try {
    const { data: src } = await axios.get(url);
    return src;
  } catch (err) {
    throw new Error('Get task source error');
  }
};

export default mainErrorHandler(getTaskSource);
