import checkWalletExists from './checkWalletExists';
import createStakingWallet from './createMainWallet';
import delegateStake from './delegateStake';
import getEarnedRewardByNode from './getEarnedRewardByNode';
import getTaskInfo from './getTaskInfo';
import getTasks from './getTasks';
import getTaskSource from './getTaskSource';
import mainAccountPubKey from './mainAccountPubKey';
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
  mainAccountPubKey,
};
