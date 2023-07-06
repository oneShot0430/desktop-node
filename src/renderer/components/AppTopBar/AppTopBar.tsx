import React from 'react';

import RefreshIcon from 'assets/svgs/refresh-icon.svg';
import {
  NotificationBanner,
  NotificationPlacement,
} from 'renderer/features/notifications';
import { useNotificationsContext } from 'renderer/features/notifications/context';

import { BackButton } from '../BackButton';
import { Button, Tooltip } from '../ui';

export function AppTopBar() {
  const { getNextNotification } = useNotificationsContext();

  // Get the first entry (a [key, value] tuple) from the Map
  const displayedNotificationEntry = getNextNotification(
    NotificationPlacement.TopBar
  );

  const handleNodeRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex justify-between w-full mx-auto h-[80px] py-2">
      {displayedNotificationEntry ? (
        <NotificationBanner
          id={displayedNotificationEntry.id}
          variant={displayedNotificationEntry.notification}
          backButtonComponent={<BackButton color="blue" />}
        />
      ) : (
        <div className="flex items-center justify-between w-full gap-4 px-4 mx-auto">
          <div className="flex items-center gap-2">
            <BackButton />
            <Tooltip tooltipContent="Refresh Node">
              <Button
                onlyIcon
                icon={
                  <RefreshIcon className="w-12 h-12 text-white" color="#fff" />
                }
                onClick={handleNodeRefresh}
              />
            </Tooltip>
          </div>
        </div>
      )}
    </div>
  );
}
