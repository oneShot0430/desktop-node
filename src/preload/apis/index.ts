import archiveTask from './archiveTask';
import checkWalletExists from './checkWalletExists';
import claimReward from './claimReward';
import createNodeWallets from './createNodeWallets';
import delegateStake from './delegateStake';
import generateSeedPhrase from './generateSeedPhrase';
import getAccountBalance from './getAccountBalance';
import getActiveAccountName from './getActiveAccountName';
import getAllAccounts from './getAllAccounts';
import getAvailableTasks from './getAvailableTasks';
import getAverageSlotTime from './getAverageSlotTime';
import getCurrentSlot from './getCurrentSlot';
import getEarnedRewardByNode from './getEarnedRewardByNode';
import getEncryptedSecretPhrase from './getEncryptedSecretPhrase';
import getMainAccountPubKey from './getMainAccountPubKey';
import getMyTasks from './getMyTasks';
import getNetworkUrl from './getNetworkUrl';
import getStakingAccountPubKey from './getStakingAccountPubKey';
import getTaskInfo from './getTaskInfo';
import getTaskLogs from './getTaskLogs';
import getTaskMetadata from './getTaskMetadata';
import getTaskNodeInfo from './getTaskNodeInfo';
import getTasksById from './getTasksById';
import getTaskSource from './getTaskSource';
import getTaskVariablesNames from './getTaskVariablesNames';
import getUserConfig from './getUserConfig';
import getVersion from './getVersion';
import initializeTasks from './initializeTasks';
import openBrowserWindow from './openBrowserWindow';
import openLogfileFolder from './openLogfileFolder';
import openNodeLogfileFolder from './openNodeLogfileFolder';
import removeAccountByName from './removeAccountByName';
import setActiveAccount from './setActiveAccount';
import startTask from './startTask';
import stopTask from './stopTask';
import storeUserConfig from './storeUserConfig';
import switchNetwork from './switchNetwork';
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
import withdrawStake from './withdrawStake';

export default {
  getTaskSource,
  getTaskMetadata,
  getTaskInfo,
  delegateStake,
  startTask,
  stopTask,
  getEarnedRewardByNode,
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
};
