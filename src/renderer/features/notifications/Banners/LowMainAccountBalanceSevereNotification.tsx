/* eslint-disable react/no-unescaped-entities */
import { Button, ButtonSize, ButtonVariant } from '@_koii/koii-styleguide';
import React from 'react';

import { useFundNewAccountModal } from 'renderer/features/common';

import { NotificationType } from '../types';

import { NotificationDisplayBanner } from './components/NotificationDisplayBanner';

export function LowMainAccountBalanceSevereNotification({
  notification,
  backButtonSlot,
}: {
  notification: NotificationType;
  backButtonSlot: React.ReactNode;
}) {
  const { showModal: showFundMainAccountModal } = useFundNewAccountModal();

  return (
    <NotificationDisplayBanner
      backButtonSlot={backButtonSlot}
      notification={notification}
      messageSlot={
        <div className="max-w-[65%]">
          Your main key is below 0.02 KOII. Fund now to keep your node working
          well.
        </div>
      }
      actionButtonSlot={
        <Button
          label="Fund Now"
          onClick={showFundMainAccountModal}
          variant={ButtonVariant.SecondaryDark}
          size={ButtonSize.SM}
          labelClassesOverrides="font-semibold w-max"
        />
      }
    />
  );
}
