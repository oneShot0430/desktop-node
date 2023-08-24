/**
 * @jest-environment node
 */

import * as koiiWeb3 from '@_koi/web3.js';
import {
  TASK_CONTRACT_ID,
  encodeData,
  TASK_INSTRUCTION_LAYOUTS,
} from '@koii-network/task-node';

import {
  getMainSystemAccountKeypair,
  getStakingAccountKeypair,
} from '../node/helpers';
import koiiTasks from '../services/koiiTasks';

import withdrawStake from './withdrawStake';

jest.spyOn(koiiWeb3.Transaction.prototype, 'add');
jest.spyOn(koiiWeb3, 'sendAndConfirmTransaction');
jest.mock('../node/helpers', () => ({
  __esModule: true,
  getMainSystemAccountKeypair: jest.fn(),
  getStakingAccountKeypair: jest.fn(),
}));
jest.mock('../services/koiiTasks', () => ({
  __esModule: true,
  default: {
    fetchStartedTaskData: jest.fn(),
  },
}));

describe('withdrawStake', () => {
  it('sends transaction with correct instruction', async () => {
    const exampleAddress = '7x8tP5ipyqPfrRSXoxgGz6EzfTe3S84J3WUvJwbTwgnY';
    const payload: any = {
      taskAccountPubKey: new koiiWeb3.PublicKey(exampleAddress),
    };

    const mainSystemAccount = koiiWeb3.Keypair.generate();
    const stakingAccKeypair = koiiWeb3.Keypair.generate();

    (getMainSystemAccountKeypair as jest.Mock).mockReturnValue(
      mainSystemAccount
    );
    (getStakingAccountKeypair as jest.Mock).mockReturnValue(stakingAccKeypair);
    (koiiWeb3.sendAndConfirmTransaction as jest.Mock).mockReturnValue(
      'example_transaction_hash'
    );

    const data = encodeData(TASK_INSTRUCTION_LAYOUTS.Withdraw, {});
    const expectedInstruction = new koiiWeb3.TransactionInstruction({
      keys: [
        {
          pubkey: new koiiWeb3.PublicKey(payload.taskAccountPubKey),
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: stakingAccKeypair.publicKey,
          isSigner: true,
          isWritable: true,
        },
        {
          pubkey: koiiWeb3.SYSVAR_CLOCK_PUBKEY,
          isSigner: false,
          isWritable: false,
        },
      ],
      programId: TASK_CONTRACT_ID,
      data,
    });

    const result = await withdrawStake({} as Event, payload);

    expect(koiiWeb3.Transaction.prototype.add).toHaveBeenCalledWith(
      expectedInstruction
    );
    expect(koiiWeb3.sendAndConfirmTransaction).toHaveBeenCalled();
    expect(koiiTasks.fetchStartedTaskData).toHaveBeenCalled();
    expect(result).toBe('example_transaction_hash');
  });
});
