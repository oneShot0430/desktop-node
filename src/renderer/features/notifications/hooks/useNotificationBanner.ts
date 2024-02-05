import { useMemo } from 'react';

import { AppNotificationsMap } from '../appNotificationsMap';
import { BannerPlacement } from '../types';
import { useNotificationStore } from '../useNotificationStore';

export const useNotificationBanner = () => {
  const notifications = useNotificationStore((state) => state.notifications);

  const notificationsWithBanner = useMemo(
    () =>
      notifications.filter((notification) => {
        const { appNotificationDataKey } = notification;
        return !!AppNotificationsMap[appNotificationDataKey]
          ?.notificationBanner;
      }),
    [notifications]
  ).sort((a, b) => {
    return a.date - b.date;
  });

  const unreadNotificationsWithBanner = useMemo(
    () =>
      notificationsWithBanner.filter(
        (notification) => !notification.read // || notification.persist
      ),
    [notificationsWithBanner]
  );

  const unreadNotificationsWithBannerTopBar = useMemo(
    () =>
      unreadNotificationsWithBanner.filter(
        (notification) =>
          notification.appNotificationDataKey &&
          AppNotificationsMap[notification.appNotificationDataKey]
            ?.notificationBanner?.placement === BannerPlacement.TopBar
      ),
    [unreadNotificationsWithBanner]
  );

  const unreadNotificationsWithBannerBottom = useMemo(
    () =>
      unreadNotificationsWithBanner.filter(
        (notification) =>
          notification.appNotificationDataKey &&
          AppNotificationsMap[notification.appNotificationDataKey]
            ?.notificationBanner?.placement === BannerPlacement.Bottom
      ),
    [unreadNotificationsWithBanner]
  );

  return {
    unreadNotificationsWithBanner,
    unreadNotificationsWithBannerTopBar,
    unreadNotificationsWithBannerBottom,
  };
};
