// UpdateAvailableNotification

import { Button, ButtonVariant, ButtonSize } from '@_koii/koii-styleguide';
import React, { useEffect } from 'react';

import { downloadAppUpdate } from 'renderer/services';

import { NotificationType } from '../types';
import { useNotificationActions } from '../useNotificationStore';

import { NotificationDisplayBanner } from './components/NotificationDisplayBanner';

export function UpdateAvailableNotification({
  notification,
  backButtonSlot,
}: {
  notification: NotificationType;
  backButtonSlot: React.ReactNode;
}) {
  const { markAsRead } = useNotificationActions();

  const [isDownloading, setIsDownloading] = React.useState(false);
  const [isDownloaded, setIsDownloaded] = React.useState(false);

  useEffect(() => {
    const destroy = window.main.onAppDownloaded(() => {
      setIsDownloading(() => false);
      setIsDownloaded(() => true);

      setTimeout(() => {
        markAsRead(notification.id);
      }, 5000);
    });

    return () => {
      destroy();
    };
  }, [isDownloaded, markAsRead, notification.id]);

  const handleUpdateDownload = () => {
    setIsDownloading(true);
    downloadAppUpdate().catch((err) => {
      console.error(err);
    });
  };

  const getContent = () => {
    if (isDownloading) {
      return 'New version is downloading...';
    }

    if (isDownloaded) {
      return 'New version is ready to install!';
    }

    return (
      <Button
        label="Update Now"
        onClick={handleUpdateDownload}
        variant={ButtonVariant.GhostDark}
        size={ButtonSize.MD}
        labelClassesOverrides="font-semibold w-max"
      />
    );
  };

  const showBannerMainContent = !isDownloading && !isDownloaded;

  return (
    <NotificationDisplayBanner
      notification={notification}
      messageSlot={
        <div className="max-w-[65%]">
          {showBannerMainContent &&
            'A new version of the node is ready for you!'}
        </div>
      }
      actionButtonSlot={getContent()}
      backButtonSlot={backButtonSlot}
    />
  );
}
