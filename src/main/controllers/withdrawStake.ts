import { Event } from 'electron';

import {
  PublicKey,
  TransactionInstruction,
  Transaction,
  sendAndConfirmTransaction,
  SYSVAR_CLOCK_PUBKEY,
} from '@_koi/web3.js';
import {
  TASK_INSTRUCTION_LAYOUTS,
  encodeData,
  TASK_CONTRACT_ID,
} from '@koii-network/task-node';
import sdk from 'main/services/sdk';
import { WithdrawStakeParam } from 'models/api';
import { throwTransactionError } from 'utils/error';

import {
  getMainSystemAccountKeypair,
  getStakingAccountKeypair,
} from '../node/helpers';
import koiiTasks from '../services/koiiTasks';

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
      { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
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

    await koiiTasks.fetchStartedTaskData();

    return res;
  } catch (e: any) {
    console.error(e);
    return throwTransactionError(e);
  }
};

export default withdrawStake;
