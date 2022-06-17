// import { Event } from 'electron';

import { PublicKey } from '@_koi/web3.js';
// import axios from 'axios';

import config from 'config';

import sdk from '../../services/sdk';
import mainErrorHandler from '../../utils/mainErrorHandler';
import { Task, TaskData } from '../type/TaskData';
// import koiiState from 'services/koiiState';
// import sdk from 'services/sdk';
async function fetchAllTasks(): Promise<Task[]> {
  let taskAccountInfo = await sdk.k2Connection.getProgramAccounts(
    new PublicKey(config.node.TASK_CONTRACT_ID)
  );
  if (taskAccountInfo === null) {
    throw 'Error: cannot find the task contract data';
  }
  taskAccountInfo = taskAccountInfo.filter(
    (e) =>
      e.account.data.length > config.node.MINIMUM_ACCEPTED_LENGTH_TASK_CONTRACT
  );
  const tasks: Task[] = taskAccountInfo.map((e) => {
    const task: Task = {
      publicKey: e.pubkey.toBase58(),
      data: JSON.parse(e.account.data.toString()) as TaskData,
    };
    return task;
  });
  return tasks;
}

export default mainErrorHandler(fetchAllTasks);
