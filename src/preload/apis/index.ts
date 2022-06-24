import checkWallet from './checkWallet';
import createStakingWallet from './createMainWallet';
import delegateStake from './delegateStake';
import getTaskInfo from './getTaskInfo';
import getTasks from './getTasks';
import getTaskSource from './getTaskSource';
import rewardWallet from './rewardWallet';
import startTask from './startTask';
import stopTask from './stopTask';
import storeMainWallet from './storeMainWallet';

export default {
  getTasks,
  getTaskSource,
  createStakingWallet,
  getTaskInfo,
  delegateStake,
  startTask,
  stopTask,
  storeMainWallet,
  rewardWallet,
  checkWallet,
};
