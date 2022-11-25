import React from 'react';

import {
  AppNotification,
  NotificationBanner,
  useNotificationsContext,
} from 'webapp/features/notifications';

import { BackButton } from '../BackButton';

export const AppTopBar = () => {
  const { pendingNotifications, addNotification, removeNotification } =
    useNotificationsContext();

  const displayedNotification = pendingNotifications[0];

  return (
    <>
      <div className="flex justify-between w-full mx-auto h-[80px] py-2">
        {displayedNotification ? (
          <NotificationBanner
            variant={AppNotification.FirstNodeReward}
            onRemove={() => removeNotification()}
          />
        ) : (
          <div className="flex items-center justify-between w-full gap-4 px-4 mx-auto">
            <BackButton />
          </div>
        )}
      </div>
      <div className="text-white">
        <button
          onClick={() => addNotification(AppNotification.FirstNodeReward)}
        >
          Add
        </button>
        <button onClick={() => removeNotification()}>Remove</button>
      </div>
    </>
  );
};
