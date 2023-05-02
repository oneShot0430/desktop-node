import { Event } from 'electron';

import { PublicKey } from '@_koi/web3.js';
import { ClaimRewardParam, ClaimRewardResponse } from 'models';

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

  const response = await namespaceInstance.claimReward(
    statePotPubKey,
    mainSystemAccountKeyPair.publicKey,
    stakingAccKeypair,
    taskStateInfoPublicKey
  );

  await koiiTasks.fetchRunningTaskData();

  return response;
};

export default claimReward;
