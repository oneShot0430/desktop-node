/* eslint-disable @cspell/spellchecker */
import { trackEvent } from '@aptabase/electron/renderer';

import { StartStopAllTasksParams } from 'main/controllers/types';
import { Task } from 'renderer/types';
import { ErrorContext, getErrorToDisplay } from 'renderer/utils/error';
import { getKoiiFromRoe } from 'utils';

import { fetchMyTasks } from './k2';

export const stopAllTasks = async (payload?: StartStopAllTasksParams) => {
  trackEvent('task_stop_all');
  return window.main.stopAllTasks(payload);
};

export const startAllTasks = async (payload?: StartStopAllTasksParams) => {
  trackEvent('task_start_all');
  return window.main.startAllTasks(payload);
};

export const getStakingAccountPublicKey = async (): Promise<string> => {
  const pubkey = await window.main.getStakingAccountPubKey();
  return pubkey;
};

export const withdrawStake = (taskAccountPubKey: string) => {
  return window.main.withdrawStake({ taskAccountPubKey });
};

export const stakeOnTask = (taskAccountPubKey: string, stakeAmount: number) => {
  const stakeAmountInKoii = getKoiiFromRoe(stakeAmount);
  return window.main.delegateStake({
    taskAccountPubKey,
    stakeAmount: stakeAmountInKoii,
  });
};
export const transferKoiiFromMainWallet = (
  accountName: string,
  amount: number,
  toWalletAddress: string
) => {
  return window.main.transferKoiiFromMainWallet({
    accountName,
    amount,
    toWalletAddress,
  });
};
export const transferKoiiFromStakingWallet = (
  accountName: string,
  amount: number,
  toWalletAddress: string
) => {
  return window.main.transferKoiiFromStakingWallet({
    accountName,
    amount,
    toWalletAddress,
  });
};

export const startTask = (taskAccountPubKey: string, isPrivate?: boolean) => {
  console.log(`${isPrivate ? 'FORCE' : ''} STARTING TASK`, taskAccountPubKey);
  return window.main.startTask({ taskAccountPubKey, isPrivate });
};

export const stopTask = (taskAccountPubKey: string) => {
  trackEvent('task_stop', { taskPublicKey: taskAccountPubKey });
  return window.main.stopTask({ taskAccountPubKey });
};

export const claimTaskReward = async (taskAccountPubKey: string) => {
  trackEvent('task_claim_reward', { taskPublicKey: taskAccountPubKey });
  return window.main.claimReward({ taskAccountPubKey });
};

export const claimRewards = async (): Promise<void> => {
  const stakingAccountPublicKey = await getStakingAccountPublicKey();
  const tasks = (await fetchMyTasks({ limit: Infinity, offset: 0 })).content;
  const getPendingRewardsByTask = (task: Task) =>
    task.availableBalances[stakingAccountPublicKey];
  const tasksWithClaimableRewards = tasks.filter(getPendingRewardsByTask);
  let numberOfFailedClaims = 0;
  let errorMessage = '';

  const promisesToClaimRewards = tasksWithClaimableRewards.map(async (task) => {
    const pendingReward = getPendingRewardsByTask(task);
    try {
      await window.main.claimReward({
        taskAccountPubKey: task.publicKey,
      });
      await window.main.storeAllTimeRewards({
        taskId: task.publicKey,
        newReward: pendingReward,
      });
    } catch (error: any) {
      console.error(`Error while claiming reward for Task: ${task.publicKey}`);
      console.error(error);
      errorMessage = getErrorToDisplay(error, ErrorContext.CLAIM_REWARD) || '';
      numberOfFailedClaims += 1;
    }
  });

  await Promise.all(promisesToClaimRewards);

  if (numberOfFailedClaims) {
    const customError = new Error(
      `Failed claims: ${numberOfFailedClaims}, Error: ${errorMessage}`
    );

    (customError as any).numberOfFailedClaims = numberOfFailedClaims;
    (customError as any).errorMessage = errorMessage;

    throw customError;
  }
};

export const redeemTokensInNewNetwork = (): Promise<number> => {
  return window.main.redeemTokensInNewNetwork();
};

export const fundStakingWalletFromMainWallet = async (amountInRoe: number) => {
  return window.main.creditStakingWalletFromMainWallet({ amountInRoe });
};
