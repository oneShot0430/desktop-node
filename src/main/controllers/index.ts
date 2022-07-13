import addTask from './addTask';
import checkWalletExists from './checkWalletExists';
import createStakingWallet from './createStakingWallet';
import delegateStake from './delegateStake';
import getEarnedRewardByNode from './getEarnedRewardByNode';
import getMainAccountPubKey from './getMainAccountPubKey';
import getMyTasks from './getMyTasks';
import getStakingAccountPubKey from './getStakingAccountPubKey';
import getTaskInfo from './getTaskInfo';
import getTaskLogs from './getTaskLogs';
import getTasks from './getTasks';
import getTaskSource from './getTaskSource';
import startTask from './startTask';
import stopTask from './stopTask';
import storeMainWallet from './storeMainWallet';

export default {
  getTasks,
  getTaskSource,
  addTask,
  createStakingWallet,
  delegateStake,
  getTaskInfo,
  startTask,
  stopTask,
  storeMainWallet,
  getEarnedRewardByNode,
  checkWalletExists,
  getMainAccountPubKey,
  getTaskLogs,
  getStakingAccountPubKey,
  getMyTasks,
};
