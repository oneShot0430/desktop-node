import { PublicKey } from '@_koi/web3.js';

import { NetworkErrors } from 'models';
import {
  FetchAllTasksParam,
  GetAvailableTasksParam,
  GetMyTasksParam,
  StoreUserConfigParam,
} from 'models/api';
import sdk from 'services/sdk';
import { getKoiiFromRoe } from 'utils';
import { Task } from 'webapp/types';

import { TaskService } from './taskService';

export const fetchAllTasks = async (
  params: FetchAllTasksParam
): Promise<Task[]> => {
  const tasks = await window.main.getTasks(params);
  console.log('FETCHING TASKS', tasks);
  return tasks.map(TaskService.parseTask);
};

export const getTasksById = (tasksIds: string[]) => {
  return window.main.getTasksById({ tasksIds }).then((tasks) => {
    console.log('GETTING TASKS BY ID', tasks);
    return tasks.filter(Boolean).map(TaskService.parseTask);
  });
};

export const fetchMyTasks = async (
  params: GetMyTasksParam
): Promise<Task[]> => {
  const tasks = await window.main.getMyTasks(params);
  console.log('FETCHING MY TASKS', tasks);
  return tasks.map(TaskService.parseTask);
};

export const fetchAvailableTasks = async (
  params: GetAvailableTasksParam
): Promise<Task[]> => {
  const tasks = await window.main.getAvailableTasks(params);
  console.log('FETCHING AVAILABLE TASKS', tasks);
  return tasks.map(TaskService.parseTask);
};

export const getRewardEarned = async (task: Task): Promise<number> => {
  const result =
    (await window.main.getEarnedRewardByNode({
      available_balances: task.availableBalances,
    })) || 0;
  console.log('GETTING REWARD', result, task.publicKey);
  return result;
};

export const getMainAccountBalance = (): Promise<number> => {
  return window.main
    .getMainAccountPubKey()
    .then((pubkey) => sdk.k2Connection.getBalance(new PublicKey(pubkey)))
    .then(getKoiiFromRoe)
    .then((balance) => {
      console.log('GETTING MAIN ACCOUNT BALANCE', balance);
      return balance;
    });
};

export const getAccountBalance = (pubKey: string) => {
  return sdk.k2Connection
    .getBalance(new PublicKey(pubKey))
    .then(getKoiiFromRoe)
    .then((balance) => {
      console.log('GETTING ACCOUNT BALANCE', pubKey, balance);
      return balance;
    });
};

export const getMainAccountPublicKey = (): Promise<string> => {
  return window.main.getMainAccountPubKey().then((pubkey) => {
    console.log('GETTING MAIN ACCOUNT PUBKEY', pubkey);
    return pubkey;
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
  // TO DO: expect amount in ROE instead of KOII from the BE
  const stakeAmountInKoii = getKoiiFromRoe(stakeAmount);
  return window.main.delegateStake({
    taskAccountPubKey,
    stakeAmount: stakeAmountInKoii,
  });
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

export const createNodeWallets = (mnemonic: string, accountName: string) => {
  console.log('CREATING ACCOUNT WALLETS', accountName);
  return window.main.createNodeWallets({ mnemonic, accountName });
};

export const generateSeedPhrase = (): Promise<string> => {
  return window.main.generateSeedPhrase().then((mnemonic) => {
    console.log('GENERATING SEED PHRASE', mnemonic);
    return mnemonic;
  });
};

export const getAllAccounts = () => {
  return window.main.getAllAccounts().then((accounts) => {
    console.log('GETTING ALL ACCOUNTS', accounts);
    return accounts;
  });
};

export const setActiveAccount = (accountName: string) => {
  return window.main
    .setActiveAccount({ accountName })
    .then((successFullySet) => {
      console.log('MAIN ACCOUNT SET', accountName, successFullySet);
      return successFullySet;
    });
};

export const getUserConfig = () => {
  return window.main.getUserConfig().then((config) => {
    console.log('GETTING USER CONFIG', config);
    return config;
  });
};

export const saveUserConfig = (config: StoreUserConfigParam) => {
  return window.main.storeUserConfig(config).then((res) => {
    console.log('SAVING USER CONFIG', res);
    return res;
  });
};

export const removeAccount = (accountName: string) => {
  return window.main.removeAccountByName({ accountName }).then((res) => {
    console.log('REMOVING ACCOUNT', res);
    return res;
  });
};

export const getTaskNodeInfo = () => {
  return window.main.getTaskNodeInfo().then((res) => {
    console.log('GETTING TASK NODE INFO', res);
    return res;
  });
};

export const openBrowserWindow = async (URL: string) => {
  await window.main.openBrowserWindow({ URL });
};

export const claimRewards = async () => {
  const tasks = await fetchMyTasks({ limit: Infinity, offset: 0 });
  const errors: Error[] = [];
  const promisesToClaimRewards = tasks.map(async ({ publicKey }) => {
    try {
      await window.main.claimReward({
        taskAccountPubKey: publicKey,
      });
    } catch (error) {
      if (!error.message.includes(NetworkErrors.NO_REWARD_PENDING_ON_TASK)) {
        errors.push(error);
      }
    }
  });
  await Promise.all(promisesToClaimRewards);
  // if we confirm we DON'T wanna do anything with partial errors, simplify the code below:
  const onlySomeTasksFailed = errors.length > 0 && errors.length < tasks.length;
  const allTasksFailed = errors.length === tasks.length;
  if (onlySomeTasksFailed) {
    return errors;
  } else if (allTasksFailed) {
    throw errors;
  } else {
    return;
  }
};
