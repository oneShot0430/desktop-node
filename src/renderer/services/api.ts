/* eslint-disable @cspell/spellchecker */
import { trackEvent } from '@aptabase/electron/renderer';
import axios from 'axios';

import { FAUCET_API_URL } from 'config/faucet';
import { StartStopAllTasksParams } from 'main/controllers/types';
import {
  Task as TaskRaw,
  GetAvailableTasksParam,
  GetMyTasksParam,
  TaskVariableData,
  TaskVariableDataWithId,
  StoreUserConfigParam,
  PairTaskVariableParamType,
  PaginatedResponse,
  RunningPrivateTasks,
  ScheduleMetadata,
  ScheduleMetadataUpdateType,
  TaskData,
} from 'models';
import { NotificationType } from 'renderer/features/notifications/types';
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

export const stopAllTasks = async (payload?: StartStopAllTasksParams) => {
  trackEvent('task_stop_all');
  return window.main.stopAllTasks(payload);
};

export const startAllTasks = async (payload?: StartStopAllTasksParams) => {
  trackEvent('task_start_all');
  return window.main.startAllTasks(payload);
};

export const fetchAvailableTasks = async (
  params: GetAvailableTasksParam
): Promise<PaginatedResponse<Task>> => {
  const response = await window.main.getAvailableTasks(params);
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
export const transferKoiiFromMainWallet = (
  accountName: string,
  amount: number,
  toWalletAddress: string
) => {
  return window.main.transferKoiiFromMainWallet({
    accountName,
    amount,
    toWalletAddress,
  });
};
export const transferKoiiFromStakingWallet = (
  accountName: string,
  amount: number,
  toWalletAddress: string
) => {
  return window.main.transferKoiiFromStakingWallet({
    accountName,
    amount,
    toWalletAddress,
  });
};

export const startTask = (taskAccountPubKey: string, isPrivate?: boolean) => {
  console.log(`${isPrivate ? 'FORCE' : ''} STARTING TASK`, taskAccountPubKey);
  return window.main.startTask({ taskAccountPubKey, isPrivate });
};

export const stopTask = (taskAccountPubKey: string) => {
  console.log('STOPPING TASK', taskAccountPubKey);
  trackEvent('task_stop', { taskPublicKey: taskAccountPubKey });
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

export const getMainLogs = () => {
  return window.main.getMainLogs({});
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
  return window.main.generateSeedPhrase();
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
  trackEvent('task_claim_reward', { taskPublicKey: taskAccountPubKey });
  return window.main.claimReward({ taskAccountPubKey });
};

export const claimRewards = async (): Promise<void> => {
  const stakingAccountPublicKey = await getStakingAccountPublicKey();
  const tasks = (await fetchMyTasks({ limit: Infinity, offset: 0 })).content;
  const getPendingRewardsByTask = (task: Task) =>
    task.availableBalances[stakingAccountPublicKey];
  const tasksWithClaimableRewards = tasks.filter(getPendingRewardsByTask);
  let numberOfFailedClaims = 0;

  const promisesToClaimRewards = tasksWithClaimableRewards.map(async (task) => {
    const pendingReward = getPendingRewardsByTask(task);
    try {
      await window.main.claimReward({
        taskAccountPubKey: task.publicKey,
      });
      await window.main.storeAllTimeRewards({
        taskId: task.publicKey,
        newReward: pendingReward,
      });
    } catch (error) {
      console.error(`Error while claiming reward for Task: ${task.publicKey}`);
      console.error(error);
      numberOfFailedClaims += 1;
    }
  });

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
  trackEvent('task_archive', { taskPublicKey: taskPubKey });
  return window.main.archiveTask({ taskPubKey });
};

export const downloadAppUpdate = async () => {
  return window.main.downloadAppUpdate();
};

export const checkAppUpdate = async () => {
  return window.main.checkAppUpdate();
};

export const getAllTimeRewards = async (taskPubKey: string) => {
  return window.main.getAllTimeRewardsByTask({ taskId: taskPubKey });
};

export const getRunnedPrivateTasks = (): Promise<RunningPrivateTasks> => {
  return window.main.getRunnedPrivateTasks();
};

export const setRunnedPrivateTasks = (privateTaskId: string): Promise<void> => {
  return window.main.setRunnedPrivateTasks({
    runnedPrivateTask: privateTaskId,
  });
};
export const getIsTaskRunning = async (taskPublicKey: string) => {
  return window.main.getIsTaskRunning({ taskPublicKey });
};

export const enableStayAwake = async () => {
  return window.main.enableStayAwake();
};

export const disableStayAwake = async () => {
  return window.main.disableStayAwake();
};

export const getStartedTasksPubKeys = async () => {
  return window.main.getStartedTasksPubKeys();
};

export const getRunningTasksPubKeys = async () => {
  return window.main.getRunningTasksPubKeys();
};

export const getTimeToNextReward = async () => {
  return window.main.getTimeToNextReward();
};

export const cancelTaskRetry = async (taskPubKey: string) => {
  return window.main.cancelTaskRetry({ taskPubKey });
};

export const getRetryDataByTaskId = async (taskPubKey: string) => {
  return window.main.getRetryDataByTaskId({ taskPubKey });
};

export const switchLaunchOnRestart = async () => {
  return window.main.switchLaunchOnRestart();
};

export const addTasksSchedulerSession = async (
  schedule: Omit<ScheduleMetadata, 'id'>
) => {
  return window.main.addSession(schedule);
};

export const updateSessionById = async (
  schedule: ScheduleMetadataUpdateType
) => {
  console.log('updating session', schedule);
  return window.main.updateSessionById(schedule);
};

export const removeTasksSchedulerSession = async (scheduleId: string) => {
  return window.main.removeSession({ id: scheduleId });
};

export const getTasksSchedulerSessions = async () => {
  return window.main.getAllSessions();
};

export const getTasksSchedulerSessionById = async (sessionId: string) => {
  return window.main.getSessionById({ id: sessionId });
};

export const getSchedulerTasks = async () => {
  return window.main.getSchedulerTasks();
};

export const addTaskToScheduler = async (taskPublicKey: string) => {
  return window.main.addTaskToScheduler({ taskPublicKey });
};

export const removeTaskFromScheduler = async (taskPublicKey: string) => {
  return window.main.removeTaskFromScheduler({ taskPublicKey });
};

export const validateSchedulerSession = (
  payload: ScheduleMetadata
): Promise<boolean> => {
  return window.main.validateSchedulerSession(payload);
};

export const fundStakingWalletFromMainWallet = async (amountInRoe: number) => {
  return window.main.creditStakingWalletFromMainWallet({ amountInRoe });
};

export const limitLogsSize = async () => {
  console.log('@@@@LIMIT LOGS');
  return window.main.limitLogsSize();
};

export const getLastSubmissionTime = async (
  task: TaskData,
  stakingPublicKey: string
): Promise<number> => {
  return window.main.getLastSubmissionTime({ task, stakingPublicKey });
};

export const getLatestAverageTaskReward = async (
  task: TaskData
): Promise<number> => {
  return window.main.getLatestAverageTaskReward({ task });
};

export const redeemTokensInNewNetwork = (): Promise<number> => {
  return window.main.redeemTokensInNewNetwork();
};

export const checkOrcaPodmanExistsAndRunning = async () => {
  return window.main.checkOrcaPodmanExistsAndRunning();
};

export const saveNotificationToDb = async (
  notificationData: NotificationType
) => {
  window.main.storeNotification({ notificationData });
};
export const removeNotificationFromDb = async (id: string) => {
  return window.main.removeNotification({ notificationId: id });
};
export const updateNotificationInDb = async (
  id: string,
  updateData: Partial<Omit<NotificationType, 'id'>>
) => {
  return window.main.updateNotification({
    notificationId: id,
    notificationData: updateData,
  });
};

export const getNotificationsFromDb = async (): Promise<NotificationType[]> => {
  return window.main.getNotificationsFromStore();
};

export const purgeNotificationsFromDb = async () => {
  return window.main.purgeNotifications();
};

export const fetchExternalNotificationsFromAws = async () => {
  return window.main.fetchS3FolderContents({
    prefix: 'alerts',
    bucket: 'koii-notifications',
  });
};
