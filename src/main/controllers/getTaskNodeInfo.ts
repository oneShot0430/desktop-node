import { ErrorType } from 'models';
import { GetTaskNodeInfoResponse } from 'models/api';
import { throwDetailedError } from 'utils';

import KoiiTasks from '../services/koiiTasks';

import getAccountBalance from './getAccountBalance';
import getMainAccountPubKey from './getMainAccountPubKey';
import getStakingAccountPubKey from './getStakingAccountPubKey';

const getTaskNodeInfo = async (_: Event): Promise<GetTaskNodeInfoResponse> => {
  try {
    const totalKOII = await getAccountBalance(_, await getMainAccountPubKey());

    const stakingPubKey = await getStakingAccountPubKey();
    let totalStaked = 0;
    let pendingRewards = 0;
    KoiiTasks.getStartedTasks().forEach((task) => {
      totalStaked += task.stake_list[stakingPubKey] || 0;
      pendingRewards += task.available_balances[stakingPubKey] || 0;
    });

    return {
      totalKOII,
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
