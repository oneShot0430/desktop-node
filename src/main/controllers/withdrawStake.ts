import { Event } from 'electron';
import * as fsSync from 'fs';

import {
  Keypair,
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
import { namespaceInstance } from 'main/node/helpers/Namespace';
import sdk from 'main/services/sdk';
import { ErrorType, NetworkErrors } from 'models';
import { WithdrawStakeParam } from 'models/api';
import { throwDetailedError } from 'utils';

import { getAppDataPath } from '../node/helpers/getAppDataPath';

// eslint-disable-next-line
const BufferLayout = require('@solana/buffer-layout');

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
