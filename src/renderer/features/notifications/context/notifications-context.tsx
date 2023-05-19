import React, { createContext, useContext, useState } from 'react';

import { AppNotification } from '../types';

export interface NotificationsContextType {
  pendingNotifications: Map<string, AppNotification>;
  addNotification: (id: string, notification: AppNotification) => void;
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
    Map<string, AppNotification>
  >(new Map());

  const addNotification = (id: string, notification: AppNotification) => {
    setPendingNotifications((prev) => new Map(prev.set(id, notification)));
  };

  const removeNotificationById = (id: string) => {
    setPendingNotifications((prev) => {
      const newMap = new Map(prev);
      newMap.delete(id);
      return newMap;
    });
  };

  return (
    <NotificationsContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{ pendingNotifications, addNotification, removeNotificationById }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}
