import { LAMPORTS_PER_SOL, PublicKey } from '@_koi/web3.js';

import sdk from 'services/sdk';
import { Task } from 'webapp/types';

import { TaskService } from './taskService';

export const fetchTasks = async (): Promise<Task[]> => {
  const tasks = await window.main.getTasks();
  console.log('FETCHING TASKS', tasks);
  return tasks.map(TaskService.parseTask);
};

export const getRewardEarned = async (task: Task): Promise<number> => {
  const result = await window.main.getEarnedRewardByNode({
    available_balances: task.availableBalances,
  });
  console.log('GETTING REWARD', result, task.publicKey);
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

export const getStakingAccountPublicKey = (): Promise<string> => {
  return window.main.getStakingAccountPubKey().then((pubkey) => {
    console.log('GETTING STAKING ACCOUNT PUBKEY', pubkey);
    return pubkey;
  });
};

export const withdrawStake = (taskAccountPubKey: string) => {
  console.log('WITHDRAWING FROM', taskAccountPubKey);
  return window.main.withdrawStake({ taskAccountPubKey });
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

export const getLogs = (taskAccountPubKey: string, noOfLines = 500) => {
  console.log('GETTING LOGS', taskAccountPubKey);
  return window.main
    .getTaskLogs({
      taskAccountPubKey,
      noOfLines,
    })
    .then((logs) => {
      console.log('--------------- NODE LOGS ----------------');
      console.log(logs);
      console.log('--------------- END OF NODE LOGS ----------------');
      return logs;
    });
};

export const createStakingWallet = (mnemonic?: string) => {
  console.log('CREATING STAKING WALLET');
  return window.main.createStakingWallet({ mnemonic });
};
