import addTask from './addTask';
import checkWalletExists from './checkWalletExists';
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
};
