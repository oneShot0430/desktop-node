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
  const tasks: Task[] = taskAccountInfo
    .map((e) => {
      try {
        const rawTaskData = JSON.parse(e.account.data.toString());
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
          cronArray: [],
        };
        const task: Task = {
          publicKey: e.pubkey.toBase58(),
          data: taskData,
        };
        return task;
      } catch (e) {
        return null as Task;
      }
    })
    .filter((e) => e != null && e.data.isWhitelisted);
  return tasks;
}

export default mainErrorHandler(fetchAllTasks);
