import { Event } from 'electron';

import {
  PublicKey,
  TransactionInstruction,
  Transaction,
  sendAndConfirmTransaction,
  SYSVAR_CLOCK_PUBKEY,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@_koi/web3.js';
import {
  TASK_INSTRUCTION_LAYOUTS,
  encodeData,
  TASK_CONTRACT_ID,
  padStringWithSpaces,
} from '@koii-network/task-node';
import { namespaceInstance } from 'main/node/helpers/Namespace';
import sdk from 'main/services/sdk';
import { DelegateStakeParam, DelegateStakeResponse } from 'models';
import { throwTransactionError } from 'utils/error';

import {
  getMainSystemAccountKeypair,
  getStakingAccountKeypair,
} from '../node/helpers';
import koiiTasks from '../services/koiiTasks';

import { getTaskInfo } from './getTaskInfo';

const TRANSACTION_FINALITY_WAIT = 5000; // 5sec
const MAX_RETRY_COUNT = 3; // Maximum number of retries for each function

const delegateStake = async (
  event: Event,
  payload: DelegateStakeParam
): Promise<DelegateStakeResponse> => {
  const { taskAccountPubKey, stakeAmount, isNetworkingTask } = payload;

  const mainSystemAccount = await getMainSystemAccountKeypair();
  const stakingAccKeypair = await getStakingAccountKeypair();

  const accountInfo = await sdk.k2Connection.getAccountInfo(
    new PublicKey(stakingAccKeypair.publicKey)
  );

  const taskState = await getTaskInfo({} as Event, { taskAccountPubKey });

  console.log('ACCOUNT OWNER', accountInfo?.owner?.toBase58());
  if (accountInfo?.owner?.toBase58() === TASK_CONTRACT_ID.toBase58()) {
    // Means account already exists
    const createSubmitterAccTransaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: mainSystemAccount.publicKey,
        toPubkey: stakingAccKeypair.publicKey,
        lamports: stakeAmount * LAMPORTS_PER_SOL,
      })
    );
    try {
      await retryWithMaxCount(sendAndConfirmTransaction, [
        sdk.k2Connection,
        createSubmitterAccTransaction,
        [mainSystemAccount],
      ]);
    } catch (e: any) {
      console.error(e);
    }
    sleep(TRANSACTION_FINALITY_WAIT);

    const subdomain = await namespaceInstance.storeGet('subdomain');
    const subdomainToEncode = isNetworkingTask && subdomain ? subdomain : '';

    const data = encodeData(TASK_INSTRUCTION_LAYOUTS.Stake, {
      stakeAmount: stakeAmount * LAMPORTS_PER_SOL,
      ipAddress: new TextEncoder().encode(
        padStringWithSpaces(subdomainToEncode, 64)
      ),
    });

    const instruction = new TransactionInstruction({
      keys: [
        {
          pubkey: new PublicKey(taskAccountPubKey),
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: stakingAccKeypair.publicKey,
          isSigner: true,
          isWritable: true,
        },
        {
          pubkey: new PublicKey(taskState.stakePotAccount),
          isSigner: false,
          isWritable: true,
        },
        { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
      ],
      programId: TASK_CONTRACT_ID,
      data,
    });
    try {
      const response = await retryWithMaxCount(sendAndConfirmTransaction, [
        sdk.k2Connection,
        new Transaction().add(instruction),
        [mainSystemAccount, stakingAccKeypair],
      ]);

      await koiiTasks.fetchStartedTaskData();

      return response;
    } catch (e: any) {
      console.error(e);
      return throwTransactionError(e);
    }
  } else {
    const createSubmitterAccTransaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: mainSystemAccount.publicKey,
        newAccountPubkey: stakingAccKeypair.publicKey,
        lamports:
          stakeAmount * LAMPORTS_PER_SOL +
          (await sdk.k2Connection.getMinimumBalanceForRentExemption(100)) +
          10000, // Adding 10,000 extra lamports for padding
        space: 100,
        programId: TASK_CONTRACT_ID,
      })
    );
    try {
      await retryWithMaxCount(sendAndConfirmTransaction, [
        sdk.k2Connection,
        createSubmitterAccTransaction,
        [mainSystemAccount, stakingAccKeypair],
      ]);
      console.log('Stake account created');
    } catch (e: any) {
      console.error(e);
      return throwTransactionError(e);
    }

    const data = encodeData(TASK_INSTRUCTION_LAYOUTS.Stake, {
      stakeAmount: stakeAmount * LAMPORTS_PER_SOL,
      ipAddress: new TextEncoder().encode(padStringWithSpaces('', 64)),
    });

    const instruction = new TransactionInstruction({
      keys: [
        {
          pubkey: new PublicKey(taskAccountPubKey),
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: stakingAccKeypair.publicKey,
          isSigner: true,
          isWritable: true,
        },
        {
          pubkey: new PublicKey(taskState.stakePotAccount),
          isSigner: false,
          isWritable: true,
        },
        { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
      ],
      programId: TASK_CONTRACT_ID,
      data,
    });

    try {
      const response = await retryWithMaxCount(sendAndConfirmTransaction, [
        sdk.k2Connection,
        new Transaction().add(instruction),
        [mainSystemAccount, stakingAccKeypair],
      ]);

      await koiiTasks.fetchStartedTaskData();

      console.log('Staking complete');

      return response;
    } catch (e: any) {
      console.error(e);
      return throwTransactionError(e);
    }
  }
};

async function retryWithMaxCount(func: any, args: any) {
  let retryCount = 0;
  while (retryCount < MAX_RETRY_COUNT) {
    try {
      const response = await func(...args);
      return response;
    } catch (error) {
      console.error(`Function call failed: ${error}`);
      retryCount += 1;
      if (retryCount === MAX_RETRY_COUNT) {
        throw error;
      }
    }
  }
  console.error(
    `Reached maximum retry count (${MAX_RETRY_COUNT}) for function call`
  );
}

const sleep = (timeout: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
};

export default delegateStake;
