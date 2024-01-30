/* eslint-disable react/no-unescaped-entities */
import React from 'react';

import { NotificationType } from '../types';

import { FundStakingAccountButton } from './components/FundStakingAccountButton';
import { NotificationDisplayBanner } from './components/NotificationDisplayBanner';

export function LowStakingAccountBalanceSevereNotification({
  notification,
  backButtonSlot,
}: {
  notification: NotificationType;
  backButtonSlot: React.ReactNode;
}) {
  return (
    <NotificationDisplayBanner
      notification={notification}
      messageSlot={
        <div className="max-w-[65%]">
          Your staking key is below 1 KOII. Fund now to keep your node in the
          network.
        </div>
      }
      actionButtonSlot={
        <FundStakingAccountButton notificationId={notification.id} />
      }
      backButtonSlot={backButtonSlot}
    />
  );
}
