import React from 'react';

import { NotificationBanner } from 'renderer/features/notifications';
import { useNotificationsContext } from 'renderer/features/notifications/context';

import { BackButton } from '../BackButton';

export function AppTopBar() {
  const { pendingNotifications } = useNotificationsContext();

  // Get the first entry (a [key, value] tuple) from the Map
  const displayedNotificationEntry = Array.from(
    pendingNotifications.entries()
  )[0];

  return (
    <div className="flex justify-between w-full mx-auto h-[80px] py-2">
      {displayedNotificationEntry ? (
        <NotificationBanner
          id={displayedNotificationEntry[0]}
          variant={displayedNotificationEntry[1]}
          backButtonComponent={<BackButton color="blue" />}
        />
      ) : (
        <div className="flex items-center justify-between w-full gap-4 px-4 mx-auto">
          <BackButton />
        </div>
      )}
    </div>
  );
}
