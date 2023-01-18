import React from 'react';

import {
  useNotificationsContext,
  NotificationBanner,
  AppNotification,
} from 'renderer/features/notifications';

import { BackButton } from '../BackButton';

export const AppTopBar = () => {
  const { pendingNotifications } = useNotificationsContext();

  const displayedNotification = pendingNotifications[0];

  return (
    <>
      <div className="flex justify-between w-full mx-auto h-[80px] py-2">
        {displayedNotification ? (
          <NotificationBanner variant={AppNotification.FirstNodeReward} />
        ) : (
          <div className="flex items-center justify-between w-full gap-4 px-4 mx-auto">
            <BackButton />
          </div>
        )}
      </div>
    </>
  );
};
