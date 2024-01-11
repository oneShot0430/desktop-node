import { onAppDownloaded, checkAppUpdate, onAppUpdate } from './appUpdates';
import archiveTask from './archiveTask';
import cancelTaskRetry from './cancelTaskRetry';
import checkOrcaPodmanExistsAndRunning from './checkOrcaPodmanExistsAndRunning';
import checkWalletExists from './checkWalletExists';
import claimReward from './claimReward';
import createNodeWallets from './createNodeWallets';
import createNodeWalletsFromJson from './createNodeWalletsFromJson';
import creditStakingWalletFromMainWallet from './creditStakingWalletFromMainWallet';
import delegateStake from './delegateStake';
import disableStayAwake from './disableStayAwake';
import downloadAppUpdate from './downloadAppUpdate';
import enableStayAwake from './enableStayAwake';
import finishEmergencyMigration from './finishEmergencyMigration';
import generateSeedPhrase from './generateSeedPhrase';
import getAccountBalance from './getAccountBalance';
import getActiveAccountName from './getActiveAccountName';
import getAllAccounts from './getAllAccounts';
import getAllTimeRewardsByTask from './getAllTimeRewardsByTask';
import getAvailableTasks from './getAvailableTasks';
import getAverageSlotTime from './getAverageSlotTime';
import getCurrentSlot from './getCurrentSlot';
import getEncryptedSecretPhrase from './getEncryptedSecretPhrase';
import getIsTaskRunning from './getIsTaskRunning';
import getLastSubmissionTime from './getLastSubmissionTime';
import getMainAccountPubKey from './getMainAccountPubKey';
import getMainLogs from './getMainLogs';
import getMyTasks from './getMyTasks';
import getNetworkUrl from './getNetworkUrl';
import getRetryDataByTaskId from './getRetryDataByTaskId';
import getRunningTasksPubKeys from './getRunningTasksPubKeys';
import getStakingAccountPubKey from './getStakingAccountPubKey';
import getStartedTasksPubKeys from './getStartedTasksPubKeys';
import getTaskInfo from './getTaskInfo';
import getTaskLogs from './getTaskLogs';
import getTaskMetadata from './getTaskMetadata';
import getTaskNodeInfo from './getTaskNodeInfo';
import getTasksById from './getTasksById';
import getTaskSource from './getTaskSource';
import getTaskVariablesNames from './getTaskVariablesNames';
import getTimeToNextReward from './getTimeToNextReward';
import getUserConfig from './getUserConfig';
import getVersion from './getVersion';
import initializeTasks from './initializeTasks';
import isValidWalletAddress from './isValidWalletAddress';
import { limitLogsSize } from './logger';
import onSystemWakeUp from './onSystemWakeUp';
import openBrowserWindow from './openBrowserWindow';
import openLogfileFolder from './openLogfileFolder';
import openNodeLogfileFolder from './openNodeLogfileFolder';
import { getRunnedPrivateTasks, setRunnedPrivateTasks } from './privateTasks';
import redeemTokensInNewNetwork from './redeemTokensInNewNetwork';
import removeAccountByName from './removeAccountByName';
import setActiveAccount from './setActiveAccount';
import startAllTasks from './startAllTasks';
import startEmergencyMigration from './startEmergencyMigration';
import startOrcaVm from './startOrcaVm';
import startTask from './startTask';
import stopAllTasks from './stopAllTasks';
import stopTask from './stopTask';
import storeAllTimeRewards from './storeAllTimeRewards';
import storeUserConfig from './storeUserConfig';
import switchLaunchOnRestart from './switchLaunchOnRestart';
import switchNetwork from './switchNetwork';
import { getLatestAverageTaskReward } from './tasks';
import {
  addSession,
  removeSession,
  updateSessionById,
  getAllSessions,
  getSessionById,
  addTaskToScheduler,
  getSchedulerTasks,
  removeTaskFromScheduler,
  validateSchedulerSession,
} from './tasksScheduler';
import {
  getStoredTaskVariables,
  storeTaskVariable,
  editTaskVariable,
  deleteTaskVariable,
  pairTaskVariable,
  getStoredPairedTaskVariables,
  getTaskPairedVariablesNamesWithLabels,
  getTasksPairedWithVariable,
} from './taskVariables';
import {
  transferKoiiFromMainWallet,
  transferKoiiFromStakingWallet,
} from './transferKOII';
import upgradeTask from './upgradeTask';
import withdrawStake from './withdrawStake';

export default {
  getTaskSource,
  getTaskMetadata,
  getTaskInfo,
  delegateStake,
  startTask,
  stopTask,
  checkWalletExists,
  getMainAccountPubKey,
  getTaskLogs,
  getStakingAccountPubKey,
  withdrawStake,
  getMyTasks,
  getTaskVariablesNames,
  getAvailableTasks,
  claimReward,
  createNodeWallets,
  createNodeWalletsFromJson,
  generateSeedPhrase,
  setActiveAccount,
  getAllAccounts,
  getActiveAccountName,
  storeUserConfig,
  getUserConfig,
  getTasksById,
  removeAccountByName,
  openBrowserWindow,
  getTaskNodeInfo,
  getStoredTaskVariables,
  storeTaskVariable,
  editTaskVariable,
  deleteTaskVariable,
  pairTaskVariable,
  getStoredPairedTaskVariables,
  getTaskPairedVariablesNamesWithLabels,
  getTasksPairedWithVariable,
  getAccountBalance,
  switchNetwork,
  getNetworkUrl,
  initializeTasks,
  getCurrentSlot,
  getAverageSlotTime,
  openLogfileFolder,
  openNodeLogfileFolder,
  getVersion,
  getEncryptedSecretPhrase,
  archiveTask,
  downloadAppUpdate,
  onAppUpdate,
  getAllTimeRewardsByTask,
  storeAllTimeRewards,
  isValidWalletAddress,
  getRunnedPrivateTasks,
  setRunnedPrivateTasks,
  getIsTaskRunning,
  disableStayAwake,
  enableStayAwake,
  onSystemWakeUp,
  getMainLogs,
  onAppDownloaded,
  checkAppUpdate,
  getStartedTasksPubKeys,
  upgradeTask,
  getRunningTasksPubKeys,
  getTimeToNextReward,
  cancelTaskRetry,
  getRetryDataByTaskId,
  switchLaunchOnRestart,
  stopAllTasks,
  startAllTasks,
  addSession,
  removeSession,
  updateSessionById,
  getAllSessions,
  getSessionById,
  addTaskToScheduler,
  getSchedulerTasks,
  removeTaskFromScheduler,
  validateSchedulerSession,
  creditStakingWalletFromMainWallet,
  checkOrcaPodmanExistsAndRunning,
  limitLogsSize,
  startEmergencyMigration,
  finishEmergencyMigration,
  getLastSubmissionTime,
  getLatestAverageTaskReward,
  redeemTokensInNewNetwork,
  transferKoiiFromMainWallet,
  transferKoiiFromStakingWallet,
  startOrcaVm,
};
