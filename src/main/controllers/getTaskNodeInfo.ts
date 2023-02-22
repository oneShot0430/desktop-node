import { Event } from 'electron';

import { PublicKey } from '@_koi/web3.js';

import { ErrorType } from '../../models';
import { GetTaskNodeInfoResponse } from '../../models/api';
import sdk from '../../services/sdk';
import { throwDetailedError } from '../../utils';
import mainErrorHandler from '../../utils/mainErrorHandler';
import { Task } from '../type/TaskData';

import fetchAlltasks from './fetchAlltasks';
import getMainAccountPubKey from './getMainAccountPubKey';
import getStakingAccountPubKey from './getStakingAccountPubKey';

const getTaskNodeInfo = async (
  event: Event,
  payload: any
): Promise<GetTaskNodeInfoResponse> => {
  try {
    const tasks: Task[] = await fetchAlltasks();
    const stakingPubKey = await getStakingAccountPubKey();
    let totalStaked = 0;
    let pendingRewards = 0;
    // totalKOII = await getMainAccountBalance()
    const totalKOII = await sdk.k2Connection.getBalance(
      new PublicKey(await getMainAccountPubKey())
    );
    tasks.forEach((e) => {
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

export default mainErrorHandler(getTaskNodeInfo);
