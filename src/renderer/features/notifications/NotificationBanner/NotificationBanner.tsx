import {
  Icon,
  CloseLine,
  Button,
  ButtonVariant,
  ButtonSize,
} from '@_koii/koii-styleguide';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

import { AppRoute } from 'renderer/types/routes';

import { BackButton } from '../../../components/BackButton';
import { useNotificationsContext } from '../context';

export enum AppNotification {
  FirstNodeReward = 'FirstNodeReward',
}

type PropsType = {
  variant: AppNotification;
};

export const NotificationBanner = ({ variant }: PropsType) => {
  const navigate = useNavigate();
  const { removeNotification } = useNotificationsContext();

  const handleSeeTasksAction = useCallback(() => {
    removeNotification();
    navigate(AppRoute.AddTask);
  }, [navigate, removeNotification]);

  const action = {
    [AppNotification.FirstNodeReward]: {
      label: 'See tasks',
      onClick: handleSeeTasksAction,
      message:
        "You've earned your first node reward! Run more tasks to easily increase your rewards.",
    },
  }[variant];

  const classNames = twMerge(
    'flex justify-between w-full px-4 mx-auto px-4 items-center gap-4',
    variant === AppNotification.FirstNodeReward && 'bg-green-2 text-finnieBlue'
  );

  return (
    <div className={classNames}>
      <BackButton color="blue" />
      <div className="max-w-[65%]">{action.message}</div>
      <div className="flex items-center gap-4 w-max">
        {action && (
          <Button
            label={action.label}
            onClick={action.onClick}
            variant={ButtonVariant.SecondaryDark}
            size={ButtonSize.SM}
            labelClassesOverrides="font-semibold w-max"
          />
        )}
        <div
          className="cursor-pointer"
          title="close"
          onClick={removeNotification}
        >
          <Icon source={CloseLine} className="h-12 w-12" />
        </div>
      </div>
    </div>
  );
};
