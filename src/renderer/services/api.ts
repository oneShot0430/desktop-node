import {
  Task as TaskRaw,
  GetAvailableTasksParam,
  GetMyTasksParam,
  TaskVariableData,
  TaskVariableDataWithId,
  StoreUserConfigParam,
  PairTaskVariableParamType,
  PaginatedResponse,
} from 'models';
import { Task } from 'renderer/types';
import { getKoiiFromRoe } from 'utils';

function parseTask({ data, publicKey }: TaskRaw): Task {
  return { publicKey, ...data };
}

export const getTasksById = (tasksIds: string[]) => {
  return window.main.getTasksById({ tasksIds }).then((tasks) => {
    console.log('GETTING TASKS BY ID', tasks);
    return tasks.filter(Boolean).map(parseTask);
  });
};

export const fetchMyTasks = async (
  params: GetMyTasksParam
): Promise<PaginatedResponse<Task>> => {
  console.log('FETCHING MY TASKS', params);
  const response = await window.main.getMyTasks(params);
  console.log('FETCHED MY TASKS', params, response);
  return {
    ...response,
    content: response.content.map(parseTask),
  };
};

export const fetchAvailableTasks = async (
  params: GetAvailableTasksParam
): Promise<PaginatedResponse<Task>> => {
  console.log('FETCHING AVAILABLE TASKS', params);
  const response = await window.main.getAvailableTasks(params);
  console.log('FETCHED AVAILABLE TASKS', params, response);
  return {
    ...response,
    content: response.content.map(parseTask),
  };
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
    .then((pubKey) => getAccountBalance(pubKey))
    .then(getKoiiFromRoe)
    .then((balance) => {
      console.log('GETTING MAIN ACCOUNT BALANCE', balance);
      return balance;
    });
};

export const getAccountBalance = (pubKey: string) => {
  return window.main.getAccountBalance(pubKey).then((balance) => {
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

export const getAverageSlotTime = (): Promise<number> => {
  return window.main.getAverageSlotTime().then((averageSlotTime) => {
    return averageSlotTime;
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
  return window.main.getStoredTaskVariables();
};

export const getTaskVariablesNames = async (taskPublicKey: string) => {
  return window.main.getTaskVariablesNames({ taskPublicKey });
};

export const getStoredPairedTaskVariables = async () => {
  return window.main.getStoredPairedTaskVariables();
};

export const getTaskPairedVariablesNamesWithLabels = async (
  taskAccountPubKey: string
) => {
  return window.main.getTaskPairedVariablesNamesWithLabels({
    taskAccountPubKey,
  });
};

export const editTaskVariable = async ({
  id,
  label,
  value,
}: TaskVariableDataWithId) => {
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

export const getTasksPairedWithVariable = async (variableId: string) => {
  return window.main.getTasksPairedWithVariable({ variableId });
};

export const getTaskMetadata = async (metadataCID: string) => {
  return window.main
    .getTaskMetadata({
      metadataCID,
    })
    .then((metadata) => {
      console.log('GETTING METADATA BY CID', metadataCID, metadata);
      return metadata;
    });
};

export const claimTaskReward = async (taskAccountPubKey: string) => {
  return window.main.claimReward({ taskAccountPubKey });
};

export const claimRewards = async (): Promise<number> => {
  const stakingAccountPublicKey = await getStakingAccountPublicKey();
  const getPendingRewardsByTask = (task: Task) =>
    task.availableBalances[stakingAccountPublicKey];
  // we keep it as an array for now to have handy not only the rewards themselves but also the number of tasks
  const rewardsNotClaimedByTask: number[] = [];
  const tasks = (await fetchMyTasks({ limit: Infinity, offset: 0 })).content;

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

export const switchNetwork = async () => {
  return window.main.switchNetwork();
};

export const getNetworkUrl = async () => {
  return window.main.getNetworkUrl();
};

export const initializeTasks = async () => {
  console.log('INITIALIZING TASKS');
  return window.main.initializeTasks();
};
