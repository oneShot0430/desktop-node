import React from 'react';

import { useNotificationComponent } from './hooks/useNotificationComponent';
import { NotificationType } from './types';

type PropsType = {
  topBarNotifications: NotificationType[];
  backButtonSlot?: React.ReactNode;
};

export function DisplayTopBarNotifications({
  topBarNotifications,
  backButtonSlot,
}: PropsType) {
  return (
    <div className="w-full">
      {topBarNotifications.map((notification) => {
        return (
          <NotificationDisplay
            notification={notification}
            key={notification.id}
            backButtonSlot={backButtonSlot}
          />
        );
      })}
    </div>
  );
}

function NotificationDisplay({
  notification,
  backButtonSlot,
}: {
  notification: NotificationType;
  backButtonSlot: React.ReactNode;
}) {
  const Component = useNotificationComponent({ notification, backButtonSlot });

  if (!Component) return null;

  return <div className="relative">{Component}</div>;
}
