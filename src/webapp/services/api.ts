import { PublicKey } from '@_koi/web3.js';

import sdk from 'services/sdk';

import { Task } from '../@type/task';

import { TaskService } from './taskService';

export const fetchTasks = async (): Promise<Task[]> => {
  const tasks = await window.main.getTasks();
  return tasks.map(TaskService.parseTask);
};

export const getRewardEarned = async (
  publicKey: string,
  availableBalances: Record<string, number>
): Promise<number> => {
  const results = await window.main.getEarnedRewardByNode({
    taskAccountPubKey: publicKey,
    available_balances: availableBalances,
  });
  return results || 0;
};

export const getMainAccountBalance = (): Promise<number> => {
  return window.main
    .getMainAccountPubKey()
    .then((pubkey) => sdk.k2Connection.getBalance(new PublicKey(pubkey)));
};

export const stakeOnTask = (taskAccountPubKey: string, stakeAmount: number) =>
  window.main.delegateStake({ taskAccountPubKey, stakeAmount });
