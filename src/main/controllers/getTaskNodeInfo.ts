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
    KoiiTasks.getAllTasks().forEach((e) => {
      totalStaked += e.data.stakeList[stakingPubKey] || 0;
      pendingRewards += e.data.availableBalances[stakingPubKey] || 0;
    });

    return {
      totalKOII,
      totalStaked: totalStaked || 0,
      pendingRewards: pendingRewards || 0,
    };
  } catch (e: any) {
    console.error(e);
    return throwDetailedError({
      detailed: e,
      type: ErrorType.GENERIC,
    });
  }
};

export default getTaskNodeInfo;
