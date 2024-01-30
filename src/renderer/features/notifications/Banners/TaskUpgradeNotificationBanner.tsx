import { Button, ButtonSize } from '@_koii/koii-styleguide';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { AppRoute } from 'renderer/types/routes';

import { NotificationType } from '../types';
import { useNotificationActions } from '../useNotificationStore';

import { NotificationDisplayBanner } from './components/NotificationDisplayBanner';

interface Props {
  notification: NotificationType;
  taskName: string;
  backButtonSlot?: React.ReactNode;
}

export function TaskUpgradeNotificationBanner({
  notification,
  taskName,
  backButtonSlot,
}: Props) {
  const navigate = useNavigate();
  const { markAsRead } = useNotificationActions();

  return (
    <NotificationDisplayBanner
      notification={notification}
      messageSlot={
        <div className="max-w-[65%]">
          Task {taskName} is now available to upgrade!
        </div>
      }
      actionButtonSlot={
        <Button
          label="Upgrade Now"
          onClick={() => {
            navigate(AppRoute.MyNode);
            markAsRead(notification.id);
          }}
          size={ButtonSize.SM}
          labelClassesOverrides="font-semibold w-max"
          buttonClassesOverrides="px-2 bg-transparent text-purple-3 border-2 border-purple-3 hover:bg-purple-3 hover:text-white"
        />
      }
      backButtonSlot={backButtonSlot}
    />
  );
}
