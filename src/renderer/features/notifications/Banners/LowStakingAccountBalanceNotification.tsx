/* eslint-disable react/no-unescaped-entities */
import React from 'react';

import { NotificationType } from '../types';

import { FundStakingAccountButton } from './components/FundStakingAccountButton';
import { NotificationDisplayBanner } from './components/NotificationDisplayBanner';

export function LowStakingAccountBalanceNotification({
  notification,
  backButtonSlot,
}: {
  notification: NotificationType;
  backButtonSlot: React.ReactNode;
}) {
  return (
    <NotificationDisplayBanner
      backButtonSlot={backButtonSlot}
      notification={notification}
      messageSlot={
        <div className="max-w-[65%]">
          Your staking key's funds are getting low. Top up now to make sure your
          node is safe.
        </div>
      }
      actionButtonSlot={
        <FundStakingAccountButton notificationId={notification.id} />
      }
    />
  );
}
