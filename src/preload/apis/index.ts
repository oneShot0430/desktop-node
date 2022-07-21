import checkWalletExists from './checkWalletExists';
import claimReward from './claimReward';
import createStakingWallet from './createStakingWallet';
import delegateStake from './delegateStake';
import getAvailableTasks from './getAvailableTasks';
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
import withdrawStake from './withdrawStake';

export default {
  getTasks,
  getTaskSource,
  createStakingWallet,
  getTaskInfo,
  delegateStake,
  startTask,
  stopTask,
  storeMainWallet,
  getEarnedRewardByNode,
  checkWalletExists,
  getMainAccountPubKey,
  getTaskLogs,
  getStakingAccountPubKey,
  withdrawStake,
  getMyTasks,
  getAvailableTasks,
  claimReward,
};
