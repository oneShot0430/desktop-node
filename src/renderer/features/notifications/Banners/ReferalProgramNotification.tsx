import {
  Icon,
  CloseLine,
  Button,
  ButtonVariant,
  ButtonSize,
} from '@_koii/koii-styleguide';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

import { AppRoute } from 'renderer/types/routes';

import { useNotificationsContext } from '../context';

export function ReferalProgramNotification({
  id,
  backButtonSlot,
}: {
  id: string;
  backButtonSlot?: React.ReactNode;
}) {
  const { removeNotificationById } = useNotificationsContext();
  const navigate = useNavigate();

  const classNames = twMerge(
    'flex justify-between w-full px-4 mx-auto px-4 items-center gap-4',
    'bg-finnieTeal text-finnieBlue'
  );

  return (
    <div className={classNames}>
      {backButtonSlot}
      <div className="max-w-[65%]">
        Refer a friend and win 5 extra tokens for each person who joins the
        network.
      </div>
      <div className="flex items-center gap-6 w-max">
        <Button
          label="Get the Code"
          onClick={() => navigate(AppRoute.Settings)}
          variant={ButtonVariant.GhostDark}
          size={ButtonSize.MD}
          labelClassesOverrides="font-semibold w-max"
        />

        <button
          className="cursor-pointer"
          title="close"
          onClick={() => removeNotificationById(id)}
        >
          <Icon source={CloseLine} className="h-9 w-9" />
        </button>
      </div>
    </div>
  );
}
