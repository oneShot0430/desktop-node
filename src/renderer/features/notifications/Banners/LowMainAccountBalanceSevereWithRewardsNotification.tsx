/* eslint-disable react/no-unescaped-entities */
import { Button, ButtonSize, ButtonVariant } from '@_koii/koii-styleguide';
import React from 'react';

import { NotificationType } from '../types';
import { useNotificationActions } from '../useNotificationStore';

import { NotificationDisplayBanner } from './components/NotificationDisplayBanner';

export function LowMainAccountBalanceSevereWithRewardsNotification({
  notification,
  backButtonSlot,
}: {
  notification: NotificationType;
  backButtonSlot: React.ReactNode;
}) {
  const claimRewardsButton = document.getElementById('claim-rewards-button');

  const { markAsRead } = useNotificationActions();

  const handleClaimRewards = () => {
    claimRewardsButton?.click();
    markAsRead(notification.id);
  };

  return (
    <NotificationDisplayBanner
      backButtonSlot={backButtonSlot}
      notification={notification}
      messageSlot={
        <div className="max-w-[65%]">
          Your main key is below 0.02 KOII. Claim some rewards to keep your node
          working well.
        </div>
      }
      actionButtonSlot={
        <Button
          label="Claim Rewards"
          onClick={handleClaimRewards}
          variant={ButtonVariant.SecondaryDark}
          size={ButtonSize.SM}
          labelClassesOverrides="font-semibold w-max"
        />
      }
    />
  );
}
