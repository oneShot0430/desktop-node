import { Event } from 'electron';

import { PublicKey } from '@_koi/web3.js';

import { GetTaskNodeInfoResponse } from 'models/api';

import sdk from '../../services/sdk';
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
    let totalStaked: number, pendingRewards: number;
    // totalKOII = await getMainAccountBalance()
    const totalKOII = await sdk.k2Connection.getBalance(
      new PublicKey(await getMainAccountPubKey())
    );
    tasks.forEach((e) => {
      totalStaked += e.data.stakeList[stakingPubKey] || 0;
      pendingRewards += e.data.availableBalances[stakingPubKey] || 0;
    });
    console.log({ totalKOII, totalStaked, pendingRewards });
    return { totalKOII, totalStaked, pendingRewards };
  } catch (err) {
    console.error(err);
    throw new Error('Get task source error');
  }
};

export default mainErrorHandler(getTaskNodeInfo);
