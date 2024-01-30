import { Button, ButtonSize, ButtonVariant } from '@_koii/koii-styleguide';
import React, { useCallback } from 'react';

import { useRunExemptionFlowModal } from 'renderer/features/common';

import { NotificationType } from '../types';
import { useNotificationActions } from '../useNotificationStore';

import { NotificationDisplayBanner } from './components/NotificationDisplayBanner';

export function RentExemptionFlowBanner({
  notification,
  backButtonSlot,
}: {
  notification: NotificationType;
  backButtonSlot: React.ReactNode;
}) {
  const { showModal: showExemptionFlowModal } = useRunExemptionFlowModal();
  const { markAsRead } = useNotificationActions();

  const handleLearnMoreClick = useCallback(() => {
    showExemptionFlowModal();
    markAsRead(notification.id);
  }, [markAsRead, notification.id, showExemptionFlowModal]);

  return (
    <NotificationDisplayBanner
      notification={notification}
      messageSlot={
        <div className="max-w-[65%]">
          We sent a little bonus to your staking key.
        </div>
      }
      actionButtonSlot={
        <Button
          label="Learn more"
          onClick={handleLearnMoreClick}
          variant={ButtonVariant.GhostDark}
          size={ButtonSize.MD}
          labelClassesOverrides="font-semibold w-max"
        />
      }
      backButtonSlot={backButtonSlot}
    />
  );
}
