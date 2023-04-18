import { Event } from 'electron';

import {
  PublicKey,
  TransactionInstruction,
  Transaction,
  sendAndConfirmTransaction,
} from '@_koi/web3.js';
import {
  TASK_INSTRUCTION_LAYOUTS,
  encodeData,
  TASK_CONTRACT_ID,
} from '@koii-network/task-node';
import sdk from 'main/services/sdk';
import { ErrorType, NetworkErrors } from 'models';
import { WithdrawStakeParam } from 'models/api';
import { throwDetailedError } from 'utils';

import {
  getMainSystemAccountKeypair,
  getStakingAccountKeypair,
} from '../node/helpers';

const withdrawStake = async (
  event: Event,
  payload: WithdrawStakeParam
): Promise<string> => {
  const { taskAccountPubKey } = payload;
  const mainSystemAccount = await getMainSystemAccountKeypair();
  const stakingAccKeypair = await getStakingAccountKeypair();

  const data = encodeData(TASK_INSTRUCTION_LAYOUTS.Withdraw, {});

  const instruction = new TransactionInstruction({
    keys: [
      {
        pubkey: new PublicKey(taskAccountPubKey),
        isSigner: false,
        isWritable: true,
      },
      { pubkey: stakingAccKeypair.publicKey, isSigner: true, isWritable: true },
    ],
    programId: TASK_CONTRACT_ID,
    data,
  });

  try {
    const res = await sendAndConfirmTransaction(
      sdk.k2Connection,
      new Transaction().add(instruction),
      [mainSystemAccount, stakingAccKeypair]
    );

    return res;
  } catch (e: any) {
    console.error(e);
    const errorType = e.message
      .toLowerCase()
      .includes(NetworkErrors.TRANSACTION_TIMEOUT)
      ? ErrorType.TRANSACTION_TIMEOUT
      : ErrorType.GENERIC;
    return throwDetailedError({
      detailed: e,
      type: errorType,
    });
  }
};

export default withdrawStake;
