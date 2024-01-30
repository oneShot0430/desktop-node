import React, { useMemo } from 'react';

import { useNotificationStore } from '../useNotificationStore';

type PropsType = {
  children: React.ReactNode;
};

export function NotificationsIndicator({ children }: PropsType) {
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadNotifications = useMemo(
    () => notifications.filter((notification) => !notification.read),
    [notifications]
  );

  if (unreadNotifications.length === 0) {
    return <div>{children}</div>;
  }

  return (
    <div className="relative">
      <div className="p-2">{children}</div>
      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
        {unreadNotifications.length}
      </span>
    </div>
  );
}
