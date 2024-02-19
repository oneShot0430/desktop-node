import { Event } from 'electron';

import { PublicKey } from '@_koi/web3.js';
import { ClaimRewardParam, ClaimRewardResponse } from 'models';
import { throwTransactionError } from 'utils/error';

import {
  getMainSystemAccountKeypair,
  getStakingAccountKeypair,
} from '../node/helpers';
import { namespaceInstance } from '../node/helpers/Namespace';
import koiiTasks from '../services/koiiTasks';

import { getTaskInfo } from './getTaskInfo';

const claimReward = async (
  event: Event,
  payload: ClaimRewardParam
): Promise<ClaimRewardResponse> => {
  const { taskAccountPubKey } = payload;
  const taskStateInfoPublicKey = new PublicKey(taskAccountPubKey);

  const stakingAccKeypair = await getStakingAccountKeypair();
  const mainSystemAccountKeyPair = await getMainSystemAccountKeypair();

  // deriving public key of claimer
  const taskState = await getTaskInfo({} as Event, { taskAccountPubKey });
  const statePotPubKey = new PublicKey(taskState.stakePotAccount);

  try {
    console.log(`Claiming reward for Task: ${taskAccountPubKey}`);
    const response = await namespaceInstance.claimReward(
      statePotPubKey,
      mainSystemAccountKeyPair.publicKey,
      stakingAccKeypair,
      taskStateInfoPublicKey
    );

    await koiiTasks.fetchStartedTaskData();

    return response;
  } catch (err: any) {
    console.error(`Failed to claim the reward for Task: ${taskAccountPubKey}`);
    console.error(err);
    return throwTransactionError(err);
  }
};

export default claimReward;
