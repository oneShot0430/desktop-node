import React, { createContext, useContext, useState } from 'react';

import { AppNotification, NotificationPlacement } from '../types';

type PendingNotification = {
  notification: AppNotification;
  type: NotificationPlacement;
  id: string;
};

export interface NotificationsContextType {
  addNotification: (
    id: string,
    notification: AppNotification,
    type: NotificationPlacement
  ) => void;
  getNextNotification: (
    type: NotificationPlacement
  ) => PendingNotification | undefined;
  removeNotificationById: (id: string) => void;
}

type NotificationsPropsType = {
  children: React.ReactNode;
};

export const NotificationsContext =
  createContext<NotificationsContextType | null>(null);

export const useNotificationsContext = () => {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error(
      'useNotificationsContext must be used within a NotificationsContextProvider'
    );
  }

  return context;
};

export function NotificationsProvider({ children }: NotificationsPropsType) {
  const [pendingNotifications, setPendingNotifications] = useState<
    PendingNotification[]
  >([]);

  const addNotification = (
    id: string,
    notification: AppNotification,
    type: NotificationPlacement
  ) => {
    setPendingNotifications((prev) => [...prev, { id, notification, type }]);
  };

  const removeNotificationById = (id: string) => {
    const updatedNotification = pendingNotifications.filter(
      (notification) => notification.id !== id
    );
    setPendingNotifications(updatedNotification);
  };

  const getNextNotification = (type: NotificationPlacement) => {
    return pendingNotifications.find(
      (notification) => notification.type === type
    );
  };

  return (
    <NotificationsContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        addNotification,
        removeNotificationById,
        getNextNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}
