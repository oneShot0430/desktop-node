import {
  Button,
  ButtonSize,
  ButtonVariant,
  DeleteTrashXlLine,
  Icon,
} from '@_koii/koii-styleguide';
import React, { useMemo, useState } from 'react';

import { Dropdown } from 'renderer/components';
import { useAccounts } from 'renderer/features/settings';

import {
  useNotificationActions,
  useNotificationStore,
} from '../useNotificationStore';

import { NotificationCenterItem } from './NotificationCenterItem';

export function NotificationsCenter() {
  const [selectedAccount, setSelectedAccount] = useState<string>();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { accounts } = useAccounts();
  const notifications = useNotificationStore((state) => state.notifications);
  const { purgeNotifications, removeNotification, markAsRead } =
    useNotificationActions();

  const handleItemOpenClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredNotifications = useMemo(
    () =>
      selectedAccount
        ? notifications.filter(
            (notification) => notification.accountPubKey === selectedAccount
          )
        : notifications,
    [notifications, selectedAccount]
  ).sort((a, b) => b.date - a.date);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between py-4">
        <Dropdown
          items={(accounts ?? []).map((account) => {
            return {
              label: account.accountName,
              id: account.mainPublicKey,
            };
          })}
          onSelect={(selectedItem) => setSelectedAccount(selectedItem.id)}
          containerClassOverrides="h-fit"
          placeholderText="Filter by account"
        />
        <Button
          variant={ButtonVariant.Warning}
          label="Clear all"
          onClick={() => purgeNotifications()}
          iconLeft={<Icon source={DeleteTrashXlLine} />}
          size={ButtonSize.SM}
          disabled={notifications.length === 0}
        />
      </div>
      <div className="h-[65vh] overflow-y-auto text-white mb-4 border-t-2 border-white">
        {filteredNotifications.length === 0 ? (
          <div className="flex items-center justify-center text-xl pt-36 text-finnieGray-secondary">
            No notifications
          </div>
        ) : (
          filteredNotifications.map((notification, index) => {
            return (
              <NotificationCenterItem
                key={notification.id}
                notification={notification}
                onNotificationRemoveClick={removeNotification}
                onOpenToggleClick={() => {
                  handleItemOpenClick(index);
                  markAsRead(notification.id);
                }}
                isOpen={openIndex === index}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
