import { Button, ButtonSize } from '@_koii/koii-styleguide';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { AppRoute } from 'renderer/types/routes';

import { NotificationType } from '../types';

import { NotificationDisplayBanner } from './components/NotificationDisplayBanner';

export function ReferralProgramNotification({
  notification,
  backButtonSlot,
}: {
  notification: NotificationType;
  backButtonSlot: React.ReactNode;
}) {
  const navigate = useNavigate();

  const onCTAClick = () => {
    navigate(AppRoute.SettingsGeneral);
  };

  return (
    <NotificationDisplayBanner
      notification={notification}
      messageSlot={
        <div className="max-w-[65%]">
          Refer a friend and win 5 extra tokens for each person who joins the
          network.
        </div>
      }
      actionButtonSlot={
        <Button
          label="Get the Code"
          onClick={onCTAClick}
          size={ButtonSize.SM}
          labelClassesOverrides="font-semibold w-max"
          buttonClassesOverrides="px-2 bg-transparent text-purple-3 border-2 border-purple-3 hover:bg-purple-3 hover:text-white"
        />
      }
      backButtonSlot={backButtonSlot}
    />
  );
}
