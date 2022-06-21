import { Event } from 'electron';

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
import sdk from 'services/sdk';

import mainErrorHandler from '../../utils/mainErrorHandler';

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

interface DelegateStakeParam {
  mainSystemAccount: Keypair;
  taskStateInfoPublicKey: PublicKey;
  stakingAccKeypair: Keypair;
  stakePotAccount: PublicKey;
  stakeAmount: number;
}

const delegateStake = async (event: Event, payload: DelegateStakeParam) => {
  const {
    mainSystemAccount,
    taskStateInfoPublicKey,
    stakingAccKeypair,
    stakePotAccount,
    stakeAmount,
  } = payload;
  //TODO: don't accept mainSystemAccount in param get the location from redis and load that
  // stakingAccKeypair Automatically get by the task_id
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
  await sendAndConfirmTransaction(
    sdk.k2Connection,
    createSubmitterAccTransaction,
    [mainSystemAccount, stakingAccKeypair]
  );
  const data = encodeData(STAKE_INSTRUCTION_LAYOUT, { stakeAmount });
  const instruction = new TransactionInstruction({
    keys: [
      {
        pubkey: taskStateInfoPublicKey,
        isSigner: false,
        isWritable: true,
      },
      {
        pubkey: stakingAccKeypair.publicKey,
        isSigner: true,
        isWritable: true,
      },
      { pubkey: stakePotAccount, isSigner: false, isWritable: true },
      { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
    ],
    programId: TASK_CONTRACT_ID,
    data: data,
  });
  const response = await sendAndConfirmTransaction(
    sdk.k2Connection,
    new Transaction().add(instruction),
    [mainSystemAccount, stakingAccKeypair]
  );
  return response;
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
