import { ErrorType } from 'models';
import { GetTaskNodeInfoResponse } from 'models/api';
import { throwDetailedError } from 'utils';

import KoiiTasks from '../services/koiiTasks';

import getStakingAccountPubKey from './getStakingAccountPubKey';

const getTaskNodeInfo = async (_: Event): Promise<GetTaskNodeInfoResponse> => {
  try {
    const stakingPubKey = await getStakingAccountPubKey();
    let totalStaked = 0;
    let pendingRewards = 0;
    (await KoiiTasks.getStartedTasks()).forEach((task) => {
      totalStaked += task.stake_list[stakingPubKey] || 0;
      pendingRewards += task.available_balances[stakingPubKey] || 0;
    });

    return {
      totalStaked: totalStaked || 0,
      pendingRewards: pendingRewards || 0,
    };
  } catch (e: any) {
    if (e?.message !== 'Tasks not fetched yet') console.error(e);
    return throwDetailedError({
      detailed: e,
      type: ErrorType.GENERIC,
    });
  }
};

export default getTaskNodeInfo;
