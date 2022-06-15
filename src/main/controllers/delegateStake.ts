import { Event } from 'electron';

import {
    Keypair,
    PublicKey,
    TransactionInstruction,
    Transaction,
    sendAndConfirmTransaction,
    SYSVAR_CLOCK_PUBKEY,
} from '@_koi/web3.js';

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
    'Koiitask22222222222222222222222222222222222',
);

interface DelegateStakeParam {
    mainSystemAccount: Keypair,
    taskStateInfoPublicKey: PublicKey,
    stakingAccKeypair: Keypair,
    stakePotAccount: PublicKey,
    stakeAmount: number
}

const delegateStake = async (event: Event, payload: DelegateStakeParam) => {
    const {
        mainSystemAccount,
        taskStateInfoPublicKey,
        stakingAccKeypair,
        stakePotAccount,
        stakeAmount,
    } = payload;
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
