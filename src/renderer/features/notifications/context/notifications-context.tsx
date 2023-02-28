import React, { createContext, useContext, useState } from 'react';

export enum AppNotification {
  FirstNodeReward = 'FirstNodeReward',
}

export interface NotificationsContextType {
  pendingNotifications: AppNotification[];
  addNotification: (notification: AppNotification) => void;
  removeNotification: () => void;
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
    AppNotification[]
  >([]);

  const addNotification = (notification: AppNotification) => {
    setPendingNotifications((prev) => [notification, ...prev]);
  };

  const removeNotification = () => {
    setPendingNotifications((prev) => prev.slice(1));
  };
  return (
    <NotificationsContext.Provider
      value={{ pendingNotifications, addNotification, removeNotification }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}
