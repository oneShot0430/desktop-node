import { Event } from 'electron';
import * as fsSync from 'fs';

import { Keypair, PublicKey } from '@_koi/web3.js';

import { ErrorType } from 'models';
import { throwDetailedError } from 'utils';

import { ClaimRewardParam, ClaimRewardResponse } from '../../models/api';
import mainErrorHandler from '../../utils/mainErrorHandler';
import { getAppDataPath } from '../node/helpers/getAppDataPath';
import { namespaceInstance } from '../node/helpers/Namespace';

import getTaskInfo from './getTaskInfo';

const claimReward = async (
  event: Event,
  payload: ClaimRewardParam
): Promise<ClaimRewardResponse> => {
  const { taskAccountPubKey } = payload;
  const taskStateInfoPublicKey = new PublicKey(taskAccountPubKey);
  const activeAccount = await namespaceInstance.storeGet('ACTIVE_ACCOUNT');

  if (!activeAccount) {
    return throwDetailedError({
      detailed: 'Please select an active account',
      type: ErrorType.NO_ACTIVE_ACCOUNT,
    });
  }

  const stakingWalletfilePath =
    getAppDataPath() + `/namespace/${activeAccount}_stakingWallet.json`;
  let stakingAccKeypair;
  try {
    stakingAccKeypair = Keypair.fromSecretKey(
      Uint8Array.from(
        JSON.parse(fsSync.readFileSync(stakingWalletfilePath, 'utf-8'))
      )
    );
  } catch (e) {
    console.error(e);
    return throwDetailedError({
      detailed: e,
      type: ErrorType.NO_ACCOUNT_KEY,
    });
  }

  // deriving public key of claimer
  console.log('stakingAccKeypair', stakingAccKeypair);
  const stakingPubKey = new PublicKey(stakingAccKeypair.publicKey);
  console.log('STAKING ACCOUNT PUBLIC KEY', stakingPubKey.toBase58());

  let taskState;
  try {
    taskState = await getTaskInfo(null, { taskAccountPubKey });
  } catch (e) {
    return throwDetailedError({
      detailed: e,
      type: ErrorType.TASK_NOT_FOUND,
    });
  }

  const statePotPubKey = new PublicKey(taskState.stakePotAccount);
  console.log('STATE POT ACCOUNT PUBLIC KEY', statePotPubKey);

  const response = await namespaceInstance.claimReward(
    statePotPubKey,
    stakingPubKey,
    stakingAccKeypair,
    taskStateInfoPublicKey
  );
  console.log('RESPONSE FROM CLAIM REWARD FUNCTION', response);
  return response;
};

export default mainErrorHandler(claimReward);
