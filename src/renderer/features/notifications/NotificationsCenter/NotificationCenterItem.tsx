import { CloseLine, Icon, InformationCircleLine } from '@_koii/koii-styleguide';
import React from 'react';

import { Button } from 'renderer/components';

import { useAppNotifications } from '../hooks/useAppNotifications';
import { NotificationType } from '../types';

import { DisplayDate } from './components/DisplayDate';
import { NotificationStatusIndicator } from './components/NotificationStatusIndicator';

type PropsType = {
  notification: NotificationType;
  onNotificationRemoveClick: (id: string) => void;
  isOpen: boolean;
  onOpenToggleClick: () => void;
};

export function NotificationCenterItem({
  notification,
  onNotificationRemoveClick,
  isOpen,
  onOpenToggleClick,
}: PropsType) {
  const { notificationDetails, getNotificationActionComponent } =
    useAppNotifications(notification.appNotificationDataKey);

  const actionComponent = getNotificationActionComponent(notification);

  return (
    <div className="border-b border-[#F5F5F5]">
      <div className="h-[64px] flex items-center justify-between">
        <div className="flex items-center gap-2" key={notification.id}>
          <Button
            onClick={onOpenToggleClick}
            icon={
              <Icon
                source={isOpen ? CloseLine : InformationCircleLine}
                size={36}
              />
            }
            onlyIcon
          />
          <div className="flex gap-2">
            <div className="mt-[3px]">
              <NotificationStatusIndicator
                isRead={notification.read}
                notificationType={notificationDetails.variant ?? 'INFO'}
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-sm font-semibold">
                {typeof notificationDetails.title === 'string' &&
                  notificationDetails.title}
              </div>
              <DisplayDate dateInMs={notification.date} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div>{actionComponent}</div>
          <Button
            onClick={() => onNotificationRemoveClick(notification.id)}
            icon={<Icon source={CloseLine} size={20} />}
            onlyIcon
          />
        </div>
      </div>

      <div
        className={`overflow-hidden transition-all ${isOpen ? 'h-20' : 'h-0'}`}
      >
        <div className="flex flex-col items-center mt-4 text-sm">
          {typeof notificationDetails.message === 'string'
            ? notificationDetails.message
            : notificationDetails.message(notification.metadata)}
        </div>
      </div>
    </div>
  );
}
