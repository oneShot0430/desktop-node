import { useCallback } from 'react';

import {
  getMainAccountPublicKey,
  getStakingAccountPublicKey,
  triggerRedemption,
} from 'renderer/services';

export const useRentExemptionFlow = () => {
  const getStakingWalletAirdrop = useCallback(async () => {
    const [mainWallet, stakingWallet] = await Promise.all([
      getMainAccountPublicKey(),
      getStakingAccountPublicKey(),
    ]);

    if (!mainWallet) {
      throw new Error('No main wallet found');
    }

    if (!stakingWallet) {
      throw new Error('No staking wallet found');
    }

    const response = await triggerRedemption({ mainWallet, stakingWallet });
    console.log('@@@response', response);
    return response;
  }, []);

  return { getStakingWalletAirdrop };
};
