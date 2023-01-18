import checkWalletExists from './checkWalletExists';
import claimReward from './claimReward';
import createNodeWallets from './createNodeWallets';
import delegateStake from './delegateStake';
import generateSeedPhrase from './generateSeedPhrase';
import getAllAccounts from './getAllAccounts';
import getAvailableTasks from './getAvailableTasks';
import getEarnedRewardByNode from './getEarnedRewardByNode';
import getMainAccountPubKey from './getMainAccountPubKey';
import getMyTasks from './getMyTasks';
import getStakingAccountPubKey from './getStakingAccountPubKey';
import getTaskInfo from './getTaskInfo';
import getTaskLogs from './getTaskLogs';
import getTaskNodeInfo from './getTaskNodeInfo';
import getTasks from './getTasks';
import getTasksById from './getTasksById';
import getTaskSource from './getTaskSource';
import getTaskVariablesNames from './getTaskVariablesNames';
import getUserConfig from './getUserConfig';
import openBrowserWindow from './openBrowserWindow';
import removeAccountByName from './removeAccountByName';
import setActiveAccount from './setActiveAccount';
import startTask from './startTask';
import stopTask from './stopTask';
import storeUserConfig from './storeUserConfig';
import {
  getStoredTaskVariables,
  storeTaskVariable,
  editTaskVariable,
  deleteTaskVariable,
  getTasksPairedWithVariable,
} from './taskVariables';
import withdrawStake from './withdrawStake';

export default {
  getTasks,
  getTaskSource,
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
  getTasksPairedWithVariable,
};
