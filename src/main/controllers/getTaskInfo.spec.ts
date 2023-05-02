import { PublicKey } from '@_koi/web3.js';
import sdk from 'main/services/sdk';
import { GetTaskInfoParam, RawTaskData, TaskData } from 'models';

import { getTaskInfo } from './getTaskInfo';

jest.mock('main/services/sdk', () => {
  return {
    k2Connection: {
      getAccountInfo: jest.fn(),
    },
  };
});

const k2PublicKeyExample = '7Ds4GdPPGb2DNEwT6is31i1KkR2WqusttB55T4QgGUvg';

const k2ConnectionGetAccountInfoMock = sdk.k2Connection
  .getAccountInfo as jest.Mock;

const testRawTaskData: RawTaskData = {
  task_id: k2PublicKeyExample,
  task_name: 'task',
  task_manager: new PublicKey(k2PublicKeyExample),
  is_whitelisted: true,
  is_active: true,
  task_audit_program: 'txId',
  stake_pot_account: new PublicKey(k2PublicKeyExample),
  total_bounty_amount: 100,
  bounty_amount_per_round: 10,
  current_round: 1,
  available_balances: {},
  stake_list: {},
  task_metadata: 'test',

  task_description: 'string',
  submissions: {},
  submissions_audit_trigger: {},
  total_stake_amount: 0,
  minimum_stake_amount: 123,
  ip_address_list: {},
  round_time: 123,
  starting_slot: 123,
  audit_window: 123,
  submission_window: 123,
  task_executable_network: 'IPFS',
  distribution_rewards_submission: {},
  distributions_audit_trigger: {},
  distributions_audit_record: {},
  task_vars: 'string',
  koii_vars: 'string',
  is_migrated: false,
  migrated_to: 'string',
  allowed_failed_distributions: 123,
};

const expectedResult: TaskData = {
  availableBalances: {},
  bountyAmountPerRound: 10,
  currentRound: 1,
  isActive: true,
  isRunning: false,
  isWhitelisted: true,
  metadataCID: 'test',
  minimumStakeAmount: 123,
  roundTime: 123,
  stakeList: {},
  stakePotAccount: '7Ds4GdPPGb2DNEwT6is31i1KkR2WqusttB55T4QgGUvg',
  taskAuditProgram: 'txId',
  taskManager: '7Ds4GdPPGb2DNEwT6is31i1KkR2WqusttB55T4QgGUvg',
  taskName: 'task',
  totalBountyAmount: 100,
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
      expectedResult
    );
  });
});
