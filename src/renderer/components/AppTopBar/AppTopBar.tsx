import React from 'react';
import { useLocation } from 'react-router-dom';

import RefreshIcon from 'assets/svgs/refresh-icon.svg';
import {
  DisplayTopBarNotifications,
  useNotificationBanner,
} from 'renderer/features/notifications';
import { AppRoute } from 'renderer/types/routes';

import { BackButton } from '../BackButton';
import { StartStopAllTasks } from '../StartStopAllTask';
import { Button, Tooltip } from '../ui';

export function AppTopBar() {
  const location = useLocation();
  const { unreadNotificationsWithBannerTopBar } = useNotificationBanner();

  const handleNodeRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="flex justify-between w-full mx-auto h-[80px] relative z-10">
      {unreadNotificationsWithBannerTopBar.length > 0 ? (
        <DisplayTopBarNotifications
          topBarNotifications={unreadNotificationsWithBannerTopBar}
          backButtonSlot={<BackButton />}
        />
      ) : (
        <div className="flex items-center justify-between w-full gap-4 px-4 mx-auto">
          <div className="flex items-center justify-center">
            <BackButton />
            <Tooltip tooltipContent="Refresh Node">
              <Button
                onlyIcon
                icon={
                  <RefreshIcon className="w-10 h-10 text-white" color="#fff" />
                }
                onClick={handleNodeRefresh}
              />
            </Tooltip>
            {AppRoute.MyNode === location.pathname && <StartStopAllTasks />}
          </div>
        </div>
      )}
    </div>
  );
}
