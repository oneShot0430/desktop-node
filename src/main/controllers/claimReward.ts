import { Event } from 'electron';
import * as fsSync from 'fs';

import { Keypair, PublicKey } from '@_koi/web3.js';
import db from 'main/db';
import { ErrorType, ClaimRewardParam, ClaimRewardResponse } from 'models';
import { throwDetailedError } from 'utils';

import { getStakingWalletPath } from '../node/helpers/getAppDataPath';
import { namespaceInstance } from '../node/helpers/Namespace';

import { getTaskInfo } from './getTaskInfo';

const claimReward = async (
  event: Event,
  payload: ClaimRewardParam
): Promise<ClaimRewardResponse> => {
  const { taskAccountPubKey } = payload;
  const ACTIVE_ACCOUNT = await namespaceInstance.storeGet('ACTIVE_ACCOUNT');
  const taskStateInfoPublicKey = new PublicKey(taskAccountPubKey);

  if (!ACTIVE_ACCOUNT) {
    return throwDetailedError({
      detailed: 'Please select an active account',
      type: ErrorType.NO_ACTIVE_ACCOUNT,
    });
  }

  const STAKING_WALLET_FILE_PATH = getStakingWalletPath(ACTIVE_ACCOUNT);

  let stakingAccKeypair;

  try {
    stakingAccKeypair = Keypair.fromSecretKey(
      Uint8Array.from(
        JSON.parse(
          fsSync.readFileSync(STAKING_WALLET_FILE_PATH, 'utf-8')
        ) as Uint8Array
      )
    );
  } catch (e: any) {
    return throwDetailedError({
      detailed: e,
      type: ErrorType.NO_ACCOUNT_KEY,
    });
  }

  // deriving public key of claimer
  const taskState = await getTaskInfo({} as Event, { taskAccountPubKey });
  const statePotPubKey = new PublicKey(taskState.stakePotAccount);

  const mainSystemAccountKeyPair =
    await namespaceInstance.getMainSystemAccountPubKey(db);

  const response = await namespaceInstance.claimReward(
    statePotPubKey,
    mainSystemAccountKeyPair.publicKey,
    stakingAccKeypair,
    taskStateInfoPublicKey
  );

  return response;
};

export default claimReward;
