// import { Event } from 'electron';

import { PublicKey } from '@_koi/web3.js';
// import axios from 'axios';

import config from '../../config';
import { FetchAllTasksParam } from '../../models/api';
import sdk from '../../services/sdk';
import mainErrorHandler from '../../utils/mainErrorHandler';
import { Task, TaskData } from '../type/TaskData';

// import koiiState from 'services/koiiState';
// import sdk from 'services/sdk';
async function fetchAllTasks(
  event: Event,
  payload: FetchAllTasksParam
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
        const rawTaskData = JSON.parse(rawData.account.data.toString());
        const taskData: TaskData = {
          taskName: rawTaskData.task_name,
          taskManager: new PublicKey(rawTaskData.task_manager).toBase58(),
          isWhitelisted: rawTaskData.is_whitelisted,
          isActive: rawTaskData.is_active,
          taskAuditProgram: rawTaskData.task_audit_program,
          stakePotAccount: new PublicKey(
            rawTaskData.stake_pot_account
          ).toBase58(),
          totalBountyAmount: rawTaskData.total_bounty_amount,
          bountyAmountPerRound: rawTaskData.bounty_amount_per_round,
          status: rawTaskData.status,
          currentRound: rawTaskData.current_round,
          availableBalances: rawTaskData.available_balances,
          stakeList: rawTaskData.stake_list,
          isRunning: false,
        };
        const task: Task = {
          publicKey: rawTaskData.pubkey.toBase58(),
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

export default mainErrorHandler(fetchAllTasks);
