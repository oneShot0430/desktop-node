import React, { createContext, useCallback, useContext, useState } from 'react';

import { AppNotification, NotificationPlacement } from '../types';

type PendingNotification = {
  notification: AppNotification;
  type: NotificationPlacement;
  id: string;
  payload?: any;
};

type AddNotification = (
  id: string,
  notification: AppNotification,
  type: NotificationPlacement,
  payload?: any
) => void;

export interface NotificationsContextType {
  addNotification: AddNotification;
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

  const addNotification: AddNotification = useCallback(
    (id, notification, type, payload) => {
      setPendingNotifications((prev) => [
        ...prev,
        { id, notification, type, payload },
      ]);
    },
    []
  );

  const removeNotificationById = (id?: string) => {
    // if there is not notification with this id, do nothing
    if (!pendingNotifications.find((notification) => notification.id === id)) {
      return;
    }

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
