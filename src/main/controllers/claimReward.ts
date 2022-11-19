import { Event } from 'electron';
import * as fsSync from 'fs';

import { Keypair, PublicKey } from '@_koi/web3.js';

import sdk from 'services/sdk';

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
  const connection = sdk.k2Connection;
  const activeAccount = await namespaceInstance.storeGet('ACTIVE_ACCOUNT');
  if (!activeAccount) {
    throw new Error('Please select a Active Account');
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
    throw Error("System Account or StakingWallet Account doesn't exist");
  }

  // deriving public key of claimer
  console.log('stakingAccKeypair', stakingAccKeypair);
  const stakingPubKey = new PublicKey(stakingAccKeypair.publicKey);
  console.log('STAKING ACCOUNT PUBLIC KEY', stakingPubKey.toBase58());

  const taskState = await getTaskInfo(null, { taskAccountPubKey });
  if (!taskState) throw new Error('Task not found');

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
