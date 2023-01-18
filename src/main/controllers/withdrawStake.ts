import { Event } from 'electron';
import * as fsSync from 'fs';

import {
  Keypair,
  PublicKey,
  TransactionInstruction,
  Transaction,
  sendAndConfirmTransaction,
} from '@_koi/web3.js';

import config from '../../config';
import { namespaceInstance } from '../../main/node/helpers/Namespace';
import { ErrorType, NetworkErrors, WithdrawStakeParam } from '../../models';
import sdk from '../../services/sdk';
import { throwDetailedError } from '../../utils';

import mainErrorHandler from '../../utils/mainErrorHandler';
import { getAppDataPath } from '../node/helpers/getAppDataPath';

// eslint-disable-next-line
const BufferLayout = require('@solana/buffer-layout');
const WITHDRAW_INSTRUCTION_LAYOUT = {
  Withdraw: {
    index: 11,
    layout: BufferLayout.struct([BufferLayout.u8('instruction')]),
  },
};

const TASK_CONTRACT_ID: PublicKey = new PublicKey(
  config.node.TASK_CONTRACT_ID || ''
);
const withdrawStake = async (
  event: Event,
  payload: WithdrawStakeParam
): Promise<string> => {
  const { taskAccountPubKey } = payload;
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
  const data = encodeData(WITHDRAW_INSTRUCTION_LAYOUT.Withdraw, {});

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
    data: data,
  });
  try {
    const res = await sendAndConfirmTransaction(
      sdk.k2Connection,
      new Transaction().add(instruction),
      [mainSystemAccount, stakingAccKeypair]
    );
    return res;
  } catch (e) {
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
export default mainErrorHandler(withdrawStake);
