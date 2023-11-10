import { Button, ButtonSize, ButtonVariant } from '@_koii/koii-styleguide';
import React from 'react';

import { useFundStakingAccountModal } from 'renderer/features/common/hooks/useFundStakingAccountModal';

import { useNotificationsContext } from '../../context';
import { AppNotification } from '../../types';

export function FundStakingAccountButton() {
  const { removeNotificationById } = useNotificationsContext();
  const { showModal: showFundStakingAccountModal } = useFundStakingAccountModal(
    {
      onWalletFundSuccess: () => {
        removeNotificationById(AppNotification.LowStakingAccountBalanceSevere);
        removeNotificationById(AppNotification.LowStakingAccountBalance);
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
