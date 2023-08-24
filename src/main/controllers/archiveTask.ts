import { ArchiveTaskParams } from 'models';

import koiiTasks from '../services/koiiTasks';

import claimReward from './claimReward';
import stakingAccountPubKey from './getStakingAccountPubKey';
import { getTaskInfo } from './getTaskInfo';

export const archiveTask = async (_: Event, payload: ArchiveTaskParams) => {
  const taskInfo = await getTaskInfo({} as Event, {
    taskAccountPubKey: payload.taskPubKey,
  });
  const currentStringAccount = await stakingAccountPubKey();
  const pendingRewards = taskInfo.availableBalances[currentStringAccount];

  if (pendingRewards) {
    await claimReward({} as Event, { taskAccountPubKey: payload.taskPubKey });
  }

  koiiTasks.removeTaskFromStartedTasks(payload.taskPubKey);
};
