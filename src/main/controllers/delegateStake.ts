import { Event } from 'electron';
import * as fsSync from 'fs';

import {
  Keypair,
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
import {
  ErrorType,
  NetworkErrors,
  DelegateStakeParam,
  DelegateStakeResponse,
} from 'models';
import { throwDetailedError } from 'utils';

import { getAppDataPath } from '../node/helpers/getAppDataPath';

import { getTaskInfo } from './getTaskInfo';

const delegateStake = async (
  event: Event,
  payload: DelegateStakeParam
): Promise<DelegateStakeResponse> => {
  const { taskAccountPubKey, stakeAmount } = payload;
  const activeAccount = await namespaceInstance.storeGet('ACTIVE_ACCOUNT');
  if (!activeAccount) {
    return throwDetailedError({
      detailed: 'Please select an active account',
      type: ErrorType.NO_ACTIVE_ACCOUNT,
    });
  }
  const stakingWalletfilePath = `${getAppDataPath()}/namespace/${activeAccount}_stakingWallet.json`;
  const mainWalletfilePath = `${getAppDataPath()}/wallets/${activeAccount}_mainSystemWallet.json`;
  let mainSystemAccount;
  let stakingAccKeypair;
  try {
    mainSystemAccount = Keypair.fromSecretKey(
      Uint8Array.from(
        JSON.parse(
          fsSync.readFileSync(mainWalletfilePath, 'utf-8')
        ) as Uint8Array
      )
    );
    stakingAccKeypair = Keypair.fromSecretKey(
      Uint8Array.from(
        JSON.parse(
          fsSync.readFileSync(stakingWalletfilePath, 'utf-8')
        ) as Uint8Array
      )
    );
  } catch (e: any) {
    console.error(e);
    return throwDetailedError({
      detailed: e,
      type: ErrorType.NO_ACCOUNT_KEY,
    });
  }
  const accountInfo = await sdk.k2Connection.getAccountInfo(
    new PublicKey(stakingAccKeypair.publicKey)
  );

  const taskState = await getTaskInfo({} as Event, { taskAccountPubKey });

  console.log('ACCOUNT OWNER', accountInfo?.owner?.toBase58());
  if (
    accountInfo?.owner?.toBase58() ===
    'Koiitask22222222222222222222222222222222222'
  ) {
    // Means account already exists
    const createSubmitterAccTransaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: mainSystemAccount.publicKey,
        toPubkey: stakingAccKeypair.publicKey,
        lamports: stakeAmount * LAMPORTS_PER_SOL,
      })
    );
    try {
      await sendAndConfirmTransaction(
        sdk.k2Connection,
        createSubmitterAccTransaction,
        [mainSystemAccount]
      );
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
  } else {
    console.log(
      mainSystemAccount.publicKey.toBase58(),
      stakingAccKeypair.publicKey.toBase58(),
      taskState.stakePotAccount
    );
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
      await sendAndConfirmTransaction(
        sdk.k2Connection,
        createSubmitterAccTransaction,
        [mainSystemAccount, stakingAccKeypair]
      );
      console.log('Stake account created');
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

    const data = encodeData(TASK_INSTRUCTION_LAYOUTS.Stake, {
      stakeAmount: stakeAmount * LAMPORTS_PER_SOL,
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
      console.log('Staking complete');

      return response;
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
  }
};

export default delegateStake;
