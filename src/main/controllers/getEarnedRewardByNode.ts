import { Event } from 'electron';

import { TaskData } from 'models';

import { getStakingAccountKeypair } from '../node/helpers';

interface rewardWalletPayload {
  available_balances: TaskData['availableBalances'];
}

// TODO(Chris): consider removal
const rewardWallet = async (
  event: Event,
  payload: rewardWalletPayload
): Promise<number> => {
  const { available_balances } = payload;

  const stakingAccKeypair = await getStakingAccountKeypair();
  const stakingPubkey = stakingAccKeypair.publicKey.toBase58();

  return available_balances[stakingPubkey];
};

export default rewardWallet;
