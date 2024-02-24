/* eslint-disable react/no-unescaped-entities */
import { Button, ButtonSize, ButtonVariant } from '@_koii/koii-styleguide';
import React from 'react';

import { openBrowserWindow } from 'renderer/services';

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
              if (notification?.ctaLink) {
                openBrowserWindow(notification.ctaLink);
                markAsRead(notification.id);
              }
            }}
            variant={ButtonVariant.SecondaryDark}
            size={ButtonSize.SM}
            labelClassesOverrides="font-semibold w-max"
          />
        </div>
      }
      backButtonSlot={backButtonSlot}
    />
  );
}
