import { PublicKey } from '@_koi/web3.js';
import sdk from 'main/services/sdk';
import { GetTaskInfoParam, TaskData } from 'models';

import { getTaskInfo } from './getTaskInfo';

jest.mock('services/sdk', () => {
  return {
    k2Connection: {
      getAccountInfo: jest.fn(),
    },
  };
});

const k2PublicKeyExample = '7Ds4GdPPGb2DNEwT6is31i1KkR2WqusttB55T4QgGUvg';

const k2ConnectionGetAccountInfoMock = sdk.k2Connection
  .getAccountInfo as jest.Mock;

const testRawTaskData = {
  task_name: 'task',
  task_manager: k2PublicKeyExample,
  is_whitelisted: true,
  is_active: true,
  task_audit_program: 'txId',
  stake_pot_account: k2PublicKeyExample,
  total_bounty_amount: 100,
  bounty_amount_per_round: 10,
  status: {},
  current_round: 1,
  available_balances: {},
  stake_list: {},
};

const parsedTaskData: Omit<TaskData, 'isRunning'> = {
  taskName: testRawTaskData.task_name,
  taskManager: new PublicKey(testRawTaskData.task_manager).toBase58(),
  isWhitelisted: testRawTaskData.is_whitelisted,
  isActive: testRawTaskData.is_active,
  taskAuditProgram: testRawTaskData.task_audit_program,
  stakePotAccount: new PublicKey(testRawTaskData.stake_pot_account).toBase58(),
  totalBountyAmount: testRawTaskData.total_bounty_amount,
  bountyAmountPerRound: testRawTaskData.bounty_amount_per_round,
  status: testRawTaskData.status,
  currentRound: testRawTaskData.current_round,
  availableBalances: testRawTaskData.available_balances,
  stakeList: testRawTaskData.stake_list,
};

describe('getTaskInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws an error if the payload is not valid - missing taskAccountPubKey', async () => {
    const invalidPayload = {};

    await expect(
      getTaskInfo({} as Event, invalidPayload as GetTaskInfoParam)
    ).rejects.toThrow(/payload is not valid/i);
  });

  it('throws an error if no Task on K2', async () => {
    k2ConnectionGetAccountInfoMock.mockResolvedValue(undefined);

    const validPayload: GetTaskInfoParam = {
      taskAccountPubKey: k2PublicKeyExample,
    };

    await expect(getTaskInfo({} as Event, validPayload)).rejects.toThrow(
      /task not found/i
    );
  });

  it('throws an error if there is Task on K2 but with invalid data - parsing error', async () => {
    k2ConnectionGetAccountInfoMock.mockResolvedValue({
      data: { toString: () => 'null' },
    });

    const validPayload: GetTaskInfoParam = {
      taskAccountPubKey: k2PublicKeyExample,
    };

    await expect(getTaskInfo({} as Event, validPayload)).rejects.toThrow(
      /Task data not found/i
    );
  });

  it('throws an error if there is Task on K2 but with invalid data - invalid parsed value', async () => {
    k2ConnectionGetAccountInfoMock.mockResolvedValue({
      data: { toString: () => 'not parsable string' },
    });

    const validPayload: GetTaskInfoParam = {
      taskAccountPubKey: k2PublicKeyExample,
    };

    await expect(getTaskInfo({} as Event, validPayload)).rejects.toThrow(
      /Error during Task parsing/i
    );
  });

  it('returns valid task data for valid payload', async () => {
    k2ConnectionGetAccountInfoMock.mockResolvedValue({
      data: {
        toString: () => JSON.stringify(testRawTaskData),
      },
    });

    const validPayload: GetTaskInfoParam = {
      taskAccountPubKey: k2PublicKeyExample,
    };

    await expect(await getTaskInfo({} as Event, validPayload)).toEqual(
      parsedTaskData
    );
  });
});
