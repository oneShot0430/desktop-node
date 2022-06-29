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
import sdk from 'services/sdk';

import mainErrorHandler from '../../utils/mainErrorHandler';
import { namespaceInstance } from '../node/helpers/Namespace';

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

interface DelegateStakeParam {
  taskAccountPubKey: string;
  // stakingAccKeypair: Keypair;
  // stakePotAccount: PublicKey;
  stakeAmount: number;
}

const delegateStake = async (event: Event, payload: DelegateStakeParam) => {
  const { taskAccountPubKey, stakeAmount } = payload;
  //TODO: don't accept mainSystemAccount in param get the location from redis and load that
  // stakingAccKeypair Automatically get by the task_id
  if (!(await namespaceInstance.storeGet('WALLET_LOCATION'))) {
    throw Error('WALLET_LOCATION not specified');
  }
  let mainSystemAccount;
  let stakingAccKeypair;
  try {
    mainSystemAccount = Keypair.fromSecretKey(
      Uint8Array.from(
        JSON.parse(
          fsSync.readFileSync(
            await namespaceInstance.storeGet('WALLET_LOCATION'),
            'utf-8'
          )
        )
      )
    );
    stakingAccKeypair = Keypair.fromSecretKey(
      Uint8Array.from(
        JSON.parse(
          fsSync.readFileSync(
            `namespace/${taskAccountPubKey}/stakingWallet.json`,
            'utf-8'
          )
        )
      )
    );
  } catch (e) {
    console.error(e);
    throw Error("System Account or StakingWallet Account doesn't exist");
  }
  const accountInfo = await sdk.k2Connection.getAccountInfo(
    new PublicKey(stakingAccKeypair.publicKey)
  );
  const taskState = await getTaskInfo(null, { taskAccountPubKey });
  if (!taskState) throw new Error('Task not found');
  // const taskData = JSON.parse(accountInfo.data.toString());

  // const taskState = {
  //   taskName: taskData.task_name,
  //   taskManager: new PublicKey(taskData.task_manager).toBase58(),
  //   isWhitelisted: taskData.is_whitelisted,
  //   isActive: taskData.is_active,
  //   taskAuditProgram: taskData.task_audit_program,
  //   stakePotAccount: new PublicKey(taskData.stake_pot_account),
  //   totalBountyAmount: taskData.total_bounty_amount,
  //   bountyAmountPerRound: taskData.bounty_amount_per_round,
  //   status: taskData.status,
  //   currentRound: taskData.current_round,
  //   availableBalances: taskData.available_balances,
  //   stakeList: taskData.stake_list,
  // };
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
    await sendAndConfirmTransaction(
      sdk.k2Connection,
      createSubmitterAccTransaction,
      [mainSystemAccount]
    );
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
    const response = await sendAndConfirmTransaction(
      sdk.k2Connection,
      new Transaction().add(instruction),
      [mainSystemAccount, stakingAccKeypair]
    );
    return response;
  } else {
    console.log(
      mainSystemAccount.publicKey,
      stakingAccKeypair.publicKey,
      stakingAccKeypair.publicKey,
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
    await sendAndConfirmTransaction(
      sdk.k2Connection,
      createSubmitterAccTransaction,
      [mainSystemAccount, stakingAccKeypair]
    );
    console.log('Stake account created');

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
    const response = await sendAndConfirmTransaction(
      sdk.k2Connection,
      new Transaction().add(instruction),
      [mainSystemAccount, stakingAccKeypair]
    );
    console.log('Staking complete');

    return response;
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
