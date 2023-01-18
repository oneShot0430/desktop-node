import { PublicKey } from '@_koi/web3.js';
import { sum } from 'lodash';

import {
  FetchAllTasksParam,
  GetAvailableTasksParam,
  GetMyTasksParam,
  TaskVariableData,
  StoreUserConfigParam,
  PairTaskVariableParamType,
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

export const storeTaskVariable = async ({ label, value }: TaskVariableData) => {
  await window.main.storeTaskVariable({ label, value });
};

export const getStoredTaskVariables = async () => {
  return await window.main.getStoredTaskVariables();
};

export const getTaskVariablesNames = async (taskPublicKey: string) => {
  return await window.main.getTaskVariablesNames({ taskPublicKey });
};

export const getStoredPairedTaskVariables = async () => {
  return await window.main.getStoredPairedTaskVariables();
};

export const editTaskVariable = async (
  id: string,
  { label, value }: TaskVariableData
) => {
  await window.main.editTaskVariable({
    variableId: id,
    variableData: { label, value },
  });
};

export const pairTaskVariable = async ({
  taskAccountPubKey,
  variableInTaskName,
  desktopVariableId,
}: PairTaskVariableParamType) => {
  await window.main.pairTaskVariable({
    taskAccountPubKey,
    variableInTaskName,
    desktopVariableId,
  });
};

export const deleteTaskVariable = async (id: string) => {
  await window.main.deleteTaskVariable(id);
};

export const claimRewards = async () => {
  const getPendingRewardsByTask = (task: Task) =>
    sum(Object.values(task.availableBalances));
  // we keep it as an array for now to have handy not only the rewards themselves but also the number of tasks
  const rewardsNotClaimedByTask: number[] = [];
  const tasks = await fetchMyTasks({ limit: Infinity, offset: 0 });
  const tasksWithClaimableRewards = tasks.filter(getPendingRewardsByTask);
  const promisesToClaimRewards = tasksWithClaimableRewards.map(async (task) => {
    try {
      await window.main.claimReward({
        taskAccountPubKey: task.publicKey,
      });
    } catch (error) {
      const pendingReward = getPendingRewardsByTask(task);
      rewardsNotClaimedByTask.push(pendingReward);
    }
  });
  await Promise.all(promisesToClaimRewards);
  const allTasksFailed = rewardsNotClaimedByTask.length === tasks.length;
  const rewardsNotClaimed = rewardsNotClaimedByTask.reduce(
    (reward, accumulator) => reward + accumulator,
    0
  );

  if (allTasksFailed) {
    throw rewardsNotClaimedByTask;
  } else {
    return rewardsNotClaimed;
  }
};
