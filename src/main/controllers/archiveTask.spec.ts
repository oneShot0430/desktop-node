import koiiTasks from '../services/koiiTasks';

import { archiveTask } from './archiveTask';
import claimReward from './claimReward';
import stakingAccountPubKey from './getStakingAccountPubKey';
import { getTaskInfo } from './getTaskInfo';

jest.mock('./getTaskInfo', () => ({
  __esModule: true,
  getTaskInfo: jest.fn().mockReturnValue({
    availableBalances: {
      example_account: 1000,
    },
  }),
}));

jest.mock('./getStakingAccountPubKey', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue('example_account'),
}));

jest.mock('./claimReward', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('../services/koiiTasks', () => ({
  __esModule: true,
  default: {
    removeTaskFromStartedTasks: jest.fn(),
  },
}));

describe('archiveTask', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('removes task and claimRewards when has rewards', async () => {
    const payload: any = {
      taskPubkey: 'example_pubkey',
    };
    await archiveTask({} as Event, payload);

    expect(getTaskInfo).toHaveBeenCalledWith(
      {},
      {
        taskAccountPubKey: payload.taskPubKey,
      }
    );
    expect(stakingAccountPubKey).toHaveBeenCalled();
    expect(claimReward).toHaveBeenCalledWith(
      {},
      { taskAccountPubKey: payload.taskPubKey }
    );
    expect(koiiTasks.removeTaskFromStartedTasks).toHaveBeenCalledWith(
      payload.taskPubKey
    );
  });

  it('removes task and does not claimReward when has no rewards', async () => {
    (stakingAccountPubKey as jest.Mock).mockReturnValue('no_rewards');

    const payload: any = {
      taskPubkey: 'example_pubkey',
    };
    await archiveTask({} as Event, payload);

    expect(claimReward).not.toHaveBeenCalled();
    expect(koiiTasks.removeTaskFromStartedTasks).toHaveBeenCalledWith(
      payload.taskPubKey
    );
  });
});
