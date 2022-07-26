import checkWalletExists from './checkWalletExists';
import claimReward from './claimReward';
import createNodeWallets from './createNodeWallets';
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
import setActiveAccount from './setActiveAccount';
import startTask from './startTask';
import stopTask from './stopTask';
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
  getAvailableTasks,
  claimReward,
  createNodeWallets,
  setActiveAccount,
};
