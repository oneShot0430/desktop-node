import { Event } from 'electron';
import fs from 'fs';

import {
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
  LAMPORTS_PER_SOL,
  TransactionInstruction,
  SYSVAR_CLOCK_PUBKEY,
} from '@_koi/web3.js';
import {
  TASK_CONTRACT_ID,
  encodeData,
  TASK_INSTRUCTION_LAYOUTS,
  padStringWithSpaces,
} from '@koii-network/task-node';
import { DUMMY_ACTIVE_TASK_FOR_STAKING_KEY_WITHDRAWAL } from 'config/node';
import sdk from 'main/services/sdk';
import { ErrorType, TransferKoiiParam } from 'models';
import { throwDetailedError, throwTransactionError } from 'utils/error';

import {
  getStakingWalletPath,
  getMainSystemAccountKeypair,
} from '../../node/helpers';
import { namespaceInstance } from '../../node/helpers/Namespace';
import { getTaskInfo } from '../getTaskInfo';

import { transferKoiiFromMainWallet } from './transferKoiiFromMainWallet';

const TRANSACTION_FINALITY_WAIT = 5000; // 5sec
const MAX_RETRY_COUNT = 3; // Maximum number of retries for each function

export const transferKoiiFromStakingWallet = async (
  event: Event,
  payload: TransferKoiiParam
): Promise<void> => {
  const { accountName, amount, toWalletAddress } = payload;
  const mainSystemAccount = await getMainSystemAccountKeypair();
  const stakingAccountPath = await getStakingWalletPath(accountName);
  let stakingAccount;
  try {
    new PublicKey(toWalletAddress);
  } catch (e) {
    return throwDetailedError({
      detailed: `${e}`,
      type: ErrorType.INVALID_WALLET_ADDRESS,
    });
  }
  if (!fs.existsSync(stakingAccountPath)) {
    return throwDetailedError({
      detailed: `No wallet found at location: ${stakingAccountPath}`,
      type: ErrorType.NO_ACCOUNT_KEY,
    });
  }

  try {
    stakingAccount = Keypair.fromSecretKey(
      Uint8Array.from(
        JSON.parse(fs.readFileSync(stakingAccountPath, 'utf-8')) as Uint8Array
      )
    );
  } catch (e: any) {
    return throwDetailedError({
      detailed: `Error during retrieving wallet from ${stakingAccountPath}: ${e}`,
      type: ErrorType.NO_ACCOUNT_KEY,
    });
  }

  try {
    const accountInfo = await sdk.k2Connection.getAccountInfo(
      new PublicKey(stakingAccount.publicKey)
    );
    if (accountInfo?.owner?.toBase58() === TASK_CONTRACT_ID.toBase58()) {
      console.log('Transfer KOII from staking account: staking Tokens');
      await retryWithMaxCount(stakeTokens, [
        mainSystemAccount,
        stakingAccount,
        amount,
        DUMMY_ACTIVE_TASK_FOR_STAKING_KEY_WITHDRAWAL,
      ]);
      sleep(TRANSACTION_FINALITY_WAIT);
      console.log('Transfer KOII from staking account: withdrawing stake');
      await retryWithMaxCount(withdrawStake, [
        mainSystemAccount,
        stakingAccount,
        DUMMY_ACTIVE_TASK_FOR_STAKING_KEY_WITHDRAWAL,
      ]);
      sleep(TRANSACTION_FINALITY_WAIT);
      console.log('Transfer KOII from staking account: claiming tokens');
      await retryWithMaxCount(claimTokens, [
        stakingAccount,
        DUMMY_ACTIVE_TASK_FOR_STAKING_KEY_WITHDRAWAL,
        toWalletAddress,
      ]);
      console.log('Transfer KOII from staking account: completed');
    } else {
      await retryWithMaxCount(transferKoiiFromMainWallet, [
        {} as Event,
        { accountName, amount, toWalletAddress },
      ]);
    }
  } catch (e: any) {
    console.error(e);
    throwTransactionError(e);
  }
};

async function retryWithMaxCount(func: any, args: any) {
  let retryCount = 0;
  while (retryCount < MAX_RETRY_COUNT) {
    try {
      await func(...args);
      return; // Exit the loop if function call succeeds
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

const stakeTokens = async (
  mainSystemAccount: Keypair,
  stakingAccKeypair: Keypair,
  stakeAmount: number,
  taskAccountPubKey: string
) => {
  const taskState = await getTaskInfo({} as Event, { taskAccountPubKey });

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
    const response = await sendAndConfirmTransaction(
      sdk.k2Connection,
      new Transaction().add(instruction),
      [mainSystemAccount, stakingAccKeypair]
    );
    return response;
  } catch (e: any) {
    console.error(e);
    throwTransactionError(e);
  }
};

const withdrawStake = async (
  mainSystemAccount: Keypair,
  stakingAccKeypair: Keypair,
  taskAccountPubKey: string
) => {
  const data = encodeData(TASK_INSTRUCTION_LAYOUTS.Withdraw, {});

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

    return res;
  } catch (e: any) {
    console.error(e);
    throwTransactionError(e);
  }
};

const claimTokens = async (
  stakingAccKeypair: Keypair,
  taskAccountPubKey: string,
  toWalletAddress: string
) => {
  const taskStateInfoPublicKey = new PublicKey(taskAccountPubKey);

  // deriving public key of claimer
  const taskState = await getTaskInfo({} as Event, { taskAccountPubKey });
  const statePotPubKey = new PublicKey(taskState.stakePotAccount);

  try {
    console.log(`Claiming reward for Task: ${taskAccountPubKey}`);
    const response = await namespaceInstance.claimReward(
      statePotPubKey,
      new PublicKey(toWalletAddress),
      stakingAccKeypair,
      taskStateInfoPublicKey
    );

    return response;
  } catch (err: any) {
    console.error(`Failed to claim the reward for Task: ${taskAccountPubKey}`);
    console.error(err);
    throwTransactionError(err);
  }
};

const sleep = (timeout: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
};
