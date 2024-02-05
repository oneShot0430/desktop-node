/* eslint-disable react/no-unescaped-entities */
import { Button, ButtonSize, ButtonVariant } from '@_koii/koii-styleguide';
import React from 'react';

import { NotificationType } from '../types';
import { useNotificationActions } from '../useNotificationStore';

import { NotificationDisplayBanner } from './components/NotificationDisplayBanner';

export function ExternalNotificationBanner({
  notification,
  backButtonSlot,
}: {
  notification: NotificationType;
  backButtonSlot: React.ReactNode;
}) {
  const { markAsRead } = useNotificationActions();

  return (
    <NotificationDisplayBanner
      notification={notification}
      messageSlot={
        <div className="max-w-[65%]">{notification?.customMessage}</div>
      }
      actionButtonSlot={
        <div className="flex items-center gap-6 w-max">
          <Button
            label={notification.ctaText}
            onClick={() => {
              window.open(notification.ctaLink, '_blank');
              markAsRead(notification.id);
            }}
            variant={ButtonVariant.PrimaryDark}
            size={ButtonSize.MD}
            labelClassesOverrides="font-semibold w-max"
            buttonClassesOverrides="bg-finnieBlue"
          />
        </div>
      }
      backButtonSlot={backButtonSlot}
    />
  );
}
