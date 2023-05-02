import { PublicKey } from '@_koi/web3.js';
import config from 'config';
import { Task, FetchAllTasksParam, RawTaskData } from 'models';

import { parseRawK2TaskData } from '../node/helpers/parseRawK2TaskData';
import sdk from '../services/sdk';

async function fetchAllTasks(
  _: Event,
  payload?: FetchAllTasksParam
): Promise<Task[]> {
  const { offset, limit } = payload || {};
  let taskAccountInfo = await sdk.k2Connection.getProgramAccounts(
    new PublicKey(config.node.TASK_CONTRACT_ID)
  );
  if (taskAccountInfo === null) {
    // eslint-disable-next-line no-throw-literal
    throw 'Error: cannot find the task contract data';
  }
  taskAccountInfo = taskAccountInfo.filter(
    (e) =>
      e.account.data.length > config.node.MINIMUM_ACCEPTED_LENGTH_TASK_CONTRACT
  );
  const tasks: Task[] = taskAccountInfo
    .map((rawData) => {
      try {
        const rawTaskData = {
          ...(JSON.parse(rawData.account.data.toString()) as object),
          task_id: rawData.pubkey.toBase58(),
        } as RawTaskData;
        const taskData = parseRawK2TaskData({ rawTaskData });
        const task: Task = {
          publicKey: rawData.pubkey.toBase58(),
          data: taskData,
        };
        return task;
      } catch (e) {
        return null;
      }
    })

    .filter(
      (task): task is Task =>
        task !== null && task.data.isWhitelisted && task.data.isActive
    );

  if (Number.isInteger(offset) && Number.isInteger(limit) && offset && limit) {
    return tasks.slice(offset, offset + limit);
  }

  return tasks;
}

export default fetchAllTasks;
