import checkWalletExists from './checkWalletExists';
import createStakingWallet from './createStakingWallet';
import delegateStake from './delegateStake';
import getEarnedRewardByNode from './getEarnedRewardByNode';
import getMainAccountPubKey from './getMainAccountPubKey';
import getTaskInfo from './getTaskInfo';
import getTasks from './getTasks';
import getTaskSource from './getTaskSource';
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
  getEarnedRewardByNode,
  checkWalletExists,
  getMainAccountPubKey,
};
