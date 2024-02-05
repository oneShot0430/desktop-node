import { useQuery } from 'react-query';

import {
  AppNotificationType,
  NotificationVariantType,
} from 'renderer/features/notifications/types';
import {
  useNotificationActions,
  useNotificationStore,
} from 'renderer/features/notifications/useNotificationStore';
import { useMainAccount } from 'renderer/features/settings/hooks/useMainAccount';
import {
  fetchExternalNotificationsFromAws,
  QueryKeys,
  saveUserConfig,
  getUserConfig,
} from 'renderer/services';
// eslint-disable-next-line @cspell/spellchecker
import { v4 as uuidv4 } from 'uuid';

type ExternalNotification = {
  id: string;
  text: string;
  title: string;
  type: NotificationVariantType;
  ctaLink: string;
  ctaText: string;
  persist: boolean;
};

export const useExternalNotifications = () => {
  const { data: mainAccount } = useMainAccount();
  const { addNotification } = useNotificationActions();
  const localNotifications = useNotificationStore(
    (state) => state.notifications
  );

  const markAsShown = (id: string) => {
    saveUserConfig({
      settings: {
        shownNotifications: [...localNotifications.map((n) => n.id), id],
      },
    });
  };

  const isNotificationShown = async (id: string) => {
    const shownNotifications = await getUserConfig();
    return shownNotifications?.shownNotifications?.includes(id);
  };

  useQuery(
    [QueryKeys.ExternalNotifications],
    fetchExternalNotificationsFromAws,
    {
      // fetch notifications while app initialization and then every 15 minutes
      refetchInterval: 15 * 60 * 1000,
      refetchIntervalInBackground: true,
      refetchOnWindowFocus: false,
      enabled: !!mainAccount,
      onSuccess(data) {
        const externalNotifications = data as ExternalNotification[];

        externalNotifications.forEach(async (externalNotification) => {
          if (
            localNotifications.some((n) => n.id === externalNotification.id)
          ) {
            return;
          }

          const wasNotificationShown = await isNotificationShown(
            externalNotification.id
          );

          if (!externalNotification.persist && wasNotificationShown) {
            // if not persist and already shown, don't show it again
            return;
          }

          const randomUuid = uuidv4();
          const notification = {
            id: externalNotification.id ?? randomUuid,
            title: externalNotification.title,
            date: Date.now(),
            read: false,
            accountPubKey: mainAccount ?? '',
            appNotificationDataKey: 'EXTERNAL_INFO' as AppNotificationType,
            variant: externalNotification.type as NotificationVariantType,
            metadata: {},
            customMessage: externalNotification.text,
            ctaLink: externalNotification.ctaLink,
            ctaText: externalNotification.ctaText,
            persist: externalNotification.persist,
          };

          addNotification(notification).then(() => {
            if (!notification.persist) {
              markAsShown(notification.id);
            }
          });
        });
      },
    }
  );
};
