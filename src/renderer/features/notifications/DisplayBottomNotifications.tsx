import React from 'react';

import { useNotificationComponent } from './hooks/useNotificationComponent';
import { NotificationType } from './types';

type PropsType = {
  bottomNotifications: NotificationType[];
  backButtonSlot?: React.ReactNode;
};

export function DisplayBottomNotifications({
  bottomNotifications,
  backButtonSlot,
}: PropsType) {
  return (
    <div>
      {bottomNotifications.map((notification) => {
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

  return Component;
}
