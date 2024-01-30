import { Button, ButtonSize, ButtonVariant } from '@_koii/koii-styleguide';
import React from 'react';

import { useFundStakingAccountModal } from 'renderer/features/common/hooks/useFundStakingAccountModal';

import { useNotificationActions } from '../../useNotificationStore';

export function FundStakingAccountButton({
  notificationId,
}: {
  notificationId: string;
}) {
  const { markAsRead } = useNotificationActions();

  const { showModal: showFundStakingAccountModal } = useFundStakingAccountModal(
    {
      onWalletFundSuccess: () => {
        markAsRead(notificationId);
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
