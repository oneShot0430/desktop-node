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

import config from 'config';
import { namespaceInstance } from 'main/node/helpers/Namespace';
import { ErrorType } from 'models';
import sdk from 'services/sdk';
import { throwDetailedError } from 'utils';

import { DelegateStakeParam, DelegateStakeResponse } from '../../models/api';
import mainErrorHandler from '../../utils/mainErrorHandler';
import { getAppDataPath } from '../node/helpers/getAppDataPath';

import getTaskInfo from './getTaskInfo';

// eslint-disable-next-line
const BufferLayout = require('@solana/buffer-layout');

const STAKE_INSTRUCTION_LAYOUT = {
  index: 10,
  layout: BufferLayout.struct([
    BufferLayout.u8('instruction'),
    BufferLayout.ns64('stakeAmount'),
  ]),
};
const TASK_CONTRACT_ID: PublicKey = new PublicKey(
  config.node.TASK_CONTRACT_ID || ''
);

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
  const stakingWalletfilePath =
    getAppDataPath() + `/namespace/${activeAccount}_stakingWallet.json`;
  const mainWalletfilePath =
    getAppDataPath() + `/wallets/${activeAccount}_mainSystemWallet.json`;
  let mainSystemAccount;
  let stakingAccKeypair;
  try {
    mainSystemAccount = Keypair.fromSecretKey(
      Uint8Array.from(
        JSON.parse(fsSync.readFileSync(mainWalletfilePath, 'utf-8'))
      )
    );
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
  const accountInfo = await sdk.k2Connection.getAccountInfo(
    new PublicKey(stakingAccKeypair.publicKey)
  );
  if (!accountInfo || !accountInfo.data)
    return throwDetailedError({
      detailed: 'Task not found',
      type: ErrorType.TASK_NOT_FOUND,
    });

  let taskState;
  try {
    taskState = await getTaskInfo(null, { taskAccountPubKey });
  } catch (e) {
    return throwDetailedError({
      detailed: e,
      type: ErrorType.TASK_NOT_FOUND,
    });
  }
  console.log('ACCOUNT OWNER', accountInfo?.owner?.toBase58());
  if (
    accountInfo?.owner?.toBase58() ==
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
    } catch (e) {
      console.error(e);
      const errorType = e.message
        .toLowerCase()
        .includes('transaction was not confirmed')
        ? ErrorType.TRANSACTION_TIMEOUT
        : ErrorType.GENERIC;
      return throwDetailedError({
        detailed: e,
        type: errorType,
      });
    }
    const data = encodeData(STAKE_INSTRUCTION_LAYOUT, {
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
      data: data,
    });
    try {
      const response = await sendAndConfirmTransaction(
        sdk.k2Connection,
        new Transaction().add(instruction),
        [mainSystemAccount, stakingAccKeypair]
      );
      return response;
    } catch (e) {
      console.error(e);
      const errorType = e.message
        .toLowerCase()
        .includes('transaction was not confirmed')
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
          10000, //Adding 10,000 extra lamports for padding
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
    } catch (e) {
      console.error(e);
      const errorType = e.message
        .toLowerCase()
        .includes('transaction was not confirmed')
        ? ErrorType.TRANSACTION_TIMEOUT
        : ErrorType.GENERIC;
      return throwDetailedError({
        detailed: e,
        type: errorType,
      });
    }

    const data = encodeData(STAKE_INSTRUCTION_LAYOUT, {
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
      data: data,
    });
    try {
      const response = await sendAndConfirmTransaction(
        sdk.k2Connection,
        new Transaction().add(instruction),
        [mainSystemAccount, stakingAccKeypair]
      );
      console.log('Staking complete');

      return response;
    } catch (e) {
      console.error(e);
      const errorType = e.message
        .toLowerCase()
        .includes('transaction was not confirmed')
        ? ErrorType.TRANSACTION_TIMEOUT
        : ErrorType.GENERIC;
      return throwDetailedError({
        detailed: e,
        type: errorType,
      });
    }
  }
};

const encodeData = (type: any, fields: any) => {
  const allocLength =
    type.layout.span >= 0 ? type.layout.span : getAlloc(type, fields);
  const data = Buffer.alloc(allocLength);
  const layoutFields = Object.assign({ instruction: type.index }, fields);
  type.layout.encode(layoutFields, data);
  return data;
};

const getAlloc = (type: any, fields: any) => {
  let alloc = 0;
  type.layout.fields.forEach((item: any) => {
    if (item.span >= 0) {
      alloc += item.span;
    } else if (typeof item.alloc === 'function') {
      alloc += item.alloc(fields[item.property]);
    }
  });
  return alloc;
};

export default mainErrorHandler(delegateStake);
