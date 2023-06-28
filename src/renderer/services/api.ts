import axios from 'axios';

import { FAUCET_API_URL } from 'config/faucet';
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

export const getEncryptedSecretPhrase = (pubKey: string) => {
  return window.main
    .getEncryptedSecretPhrase(pubKey)
    .then((encryptedSecretPhrase) => {
      return encryptedSecretPhrase;
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
  const stakeAmountInKoii = getKoiiFromRoe(stakeAmount);
  return window.main.delegateStake({
    taskAccountPubKey,
    stakeAmount: stakeAmountInKoii,
  });
};

export const startTask = (taskAccountPubKey: string, force?: boolean) => {
  console.log(`${force ? 'FORCE' : ''} STARTING TASK`, taskAccountPubKey);
  return window.main.startTask({ taskAccountPubKey, force });
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

export const createNodeWallets = (
  mnemonic: string,
  accountName: string,
  encryptedSecretPhrase: string
) => {
  console.log('CREATING ACCOUNT WALLETS', accountName);
  return window.main.createNodeWallets({
    mnemonic,
    accountName,
    encryptedSecretPhrase,
  });
};

export const createNodeWalletsFromJson = (
  jsonKey: number[],
  accountName: string
) => {
  console.log('CREATING ACCOUNT WALLETS', accountName);
  return window.main.createNodeWalletsFromJson({
    accountName,
    jsonKey,
  });
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

export const switchUpdateChannel = (channel: string) => {
  const alphaUpdatesEnabled: boolean = channel === 'alpha';
  return window.main
    .storeUserConfig({ settings: { alphaUpdatesEnabled } })
    .then((res) => {
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

export const getCurrentSlot = async () => {
  return window.main.getCurrentSlot();
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

export const claimRewards = async (): Promise<void> => {
  const stakingAccountPublicKey = await getStakingAccountPublicKey();
  const tasks = (await fetchMyTasks({ limit: Infinity, offset: 0 })).content;
  const getPendingRewardsByTask = (task: Task) =>
    task.availableBalances[stakingAccountPublicKey];
  const tasksWithClaimableRewards = tasks.filter(getPendingRewardsByTask);
  let numberOfFailedClaims = 0;

  const promisesToClaimRewards = tasksWithClaimableRewards.map(
    async (task, index) => {
      const pendingReward = getPendingRewardsByTask(task);
      try {
        // if (index === 0) {
        //   throw Error('test error');
        // } else {
        await window.main.claimReward({
          taskAccountPubKey: task.publicKey,
        });
        console.log('@@@ Storing all time rewards for: ', task.publicKey);
        await window.main.storeAllTimeRewards({
          taskId: task.publicKey,
          newReward: pendingReward,
        });
        // }
      } catch (error) {
        console.error(
          `Error while claiming reward for Task: ${task.publicKey}`
        );
        console.error(error);
        numberOfFailedClaims += 1;
      }
    }
  );

  await Promise.all(promisesToClaimRewards);

  if (numberOfFailedClaims) {
    throw Error(String(numberOfFailedClaims));
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

export const getReferralCode = async (walletAddress: string) => {
  if (walletAddress) {
    const {
      data: { code },
    } = await axios.get<{ code: string }>(
      `${FAUCET_API_URL}/get-referral-code/${walletAddress}`
    );

    return code;
  }
};

export const openLogfileFolder = async (taskPublicKey: string) => {
  if (!taskPublicKey) return false;
  return window.main.openLogfileFolder({
    taskAccountPublicKey: taskPublicKey,
  });
};

export const getActiveAccountName = async () => {
  return window.main.getActiveAccountName();
};

export const getVersion = async () => {
  console.log('CHECKING VERSION');
  return window.main.getVersion();
};

export const archiveTask = async (taskPubKey: string) => {
  return window.main.archiveTask({ taskPubKey });
};

export const downloadAppUpdate = async () => {
  return window.main.downloadAppUpdate();
};

export const getAllTimeRewards = async (taskPubKey: string) => {
  return window.main.getAllTimeRewardsByTask({ taskId: taskPubKey });
};

export const enableStayAwake = async () => {
  return window.main.enableStayAwake();
};

export const disableStayAwake = async () => {
  return window.main.disableStayAwake();
};
