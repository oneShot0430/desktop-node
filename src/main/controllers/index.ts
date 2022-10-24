import addTask from './addTask';
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
import getTasks from './getTasks';
import getTasksById from './getTasksById';
import getTaskSource from './getTaskSource';
import getUserConfig from './getUserConfig';
import openFaucet from './openFaucet';
import removeAccountByName from './removeAccountByName';
import setActiveAccount from './setActiveAccount';
import startTask from './startTask';
import stopTask from './stopTask';
import storeUserConfig from './storeUserConfig';

export default {
  getTasks,
  getTaskSource,
  addTask,
  delegateStake,
  getTaskInfo,
  startTask,
  stopTask,
  getEarnedRewardByNode,
  checkWalletExists,
  getMainAccountPubKey,
  getTaskLogs,
  getStakingAccountPubKey,
  getMyTasks,
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
  openFaucet,
};
