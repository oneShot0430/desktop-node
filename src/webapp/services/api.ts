import { LAMPORTS_PER_SOL, PublicKey } from '@_koi/web3.js';

import sdk from 'services/sdk';
import { Task } from 'webapp/@type/task';

import { TaskService } from './taskService';

export const fetchTasks = async (): Promise<Task[]> => {
  const tasks = await window.main.getTasks();
  console.log('FETCHING TASKS', tasks);
  return tasks.map(TaskService.parseTask);
};

export const getRewardEarned = async (
  publicKey: string,
  availableBalances: Record<string, number>
): Promise<number> => {
  const result = await window.main.getEarnedRewardByNode({
    taskAccountPubKey: publicKey,
    available_balances: availableBalances,
  });
  console.log('GETTING REWARD', result, publicKey);
  return result || 0;
};

export const getMainAccountBalance = (): Promise<number> => {
  return window.main
    .getMainAccountPubKey()
    .then((pubkey) => sdk.k2Connection.getBalance(new PublicKey(pubkey)))
    .then((lamports) => lamports / LAMPORTS_PER_SOL)
    .then((balance) => {
      console.log('GETTING MAIN ACCOUNT BALANCE', balance);
      return balance;
    });
};

export const stakeOnTask = (taskAccountPubKey: string, stakeAmount: number) => {
  console.log('STAKING ON', stakeAmount, taskAccountPubKey);
  return window.main.delegateStake({ taskAccountPubKey, stakeAmount });
};

export const startTask = (taskAccountPubKey: string) => {
  console.log('STARTING TASK', taskAccountPubKey);
  return window.main.startTask({ taskAccountPubKey });
};

export const stopTask = (taskAccountPubKey: string) => {
  console.log('STOPING TASK', taskAccountPubKey);
  return window.main.stopTask({ taskAccountPubKey });
};
