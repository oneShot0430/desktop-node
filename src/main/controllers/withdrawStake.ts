import { Event } from 'electron';
import * as fsSync from 'fs';

import {
  Keypair,
  PublicKey,
  TransactionInstruction,
  Transaction,
  sendAndConfirmTransaction,
} from '@_koi/web3.js';

import config from 'config';
import { WithdrawStakeParam } from 'models/api';
import sdk from 'services/sdk';

import mainErrorHandler from '../../utils/mainErrorHandler';
import { namespaceInstance } from '../node/helpers/Namespace';

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
        JSON.parse(fsSync.readFileSync('namespace/stakingWallet.json', 'utf-8'))
      )
    );
  } catch (e) {
    console.error(e);
    throw Error("System Account or StakingWallet Account doesn't exist");
  }
  const data = encodeData(WITHDRAW_INSTRUCTION_LAYOUT, {});

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
  const res = await sendAndConfirmTransaction(
    sdk.k2Connection,
    new Transaction().add(instruction),
    [mainSystemAccount, stakingAccKeypair]
  );
  return res;
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
