import { Button, ButtonSize, ButtonVariant } from '@_koii/koii-styleguide';
import React from 'react';
import { useQueryClient } from 'react-query';

import { useFundStakingAccountModal } from 'renderer/features/common/hooks/useFundStakingAccountModal';
import { useMainAccount, useStakingAccount } from 'renderer/features/settings';
import { QueryKeys } from 'renderer/services';

import { useNotificationActions } from '../../useNotificationStore';

export function FundStakingAccountButton({
  notificationId,
}: {
  notificationId: string;
}) {
  const queryCache = useQueryClient();
  const { markAsRead } = useNotificationActions();
  const { data: stakingPublicKey } = useStakingAccount();
  const { data: mainAccountPublicKey } = useMainAccount();
  const invalidateQueries = () => {
    queryCache.invalidateQueries([QueryKeys.AccountBalance, stakingPublicKey]);
    queryCache.invalidateQueries([
      QueryKeys.MainAccountBalance,
      mainAccountPublicKey,
    ]);
  };

  const { showModal: showFundStakingAccountModal } = useFundStakingAccountModal(
    {
      onWalletFundSuccess: () => {
        invalidateQueries();
        setTimeout(() => {
          invalidateQueries();
          // await 15sec until balances are updated on chain
        }, 1000 * 15);

        markAsRead(notificationId);
      },
    }
  );

  return (
    <Button
      label="Fund Now"
      onClick={showFundStakingAccountModal}
      variant={ButtonVariant.SecondaryDark}
      size={ButtonSize.SM}
      labelClassesOverrides="font-semibold w-max"
    />
  );
}
