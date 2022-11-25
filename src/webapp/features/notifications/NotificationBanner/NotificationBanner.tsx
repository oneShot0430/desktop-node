import {
  Icon,
  CloseXLine,
  Button,
  ButtonVariant,
  ButtonSize,
} from '@_koii/koii-styleguide';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import { BackButton } from '../../../components/BackButton';

export enum AppNotification {
  FirstNodeReward = 'FirstNodeReward',
}

type PropsType = {
  variant: AppNotification;
  onRemove: () => void;
};

export const NotificationBanner = ({ variant, onRemove }: PropsType) => {
  const action = {
    [AppNotification.FirstNodeReward]: {
      label: 'See task',
      onClick: () => {
        console.log('See task');
      },
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
      <div className="max-w-[65%]">{action?.message ?? ''}</div>
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
        <div className="cursor-pointer" title="close" onClick={onRemove}>
          <Icon size={46} source={CloseXLine} />
        </div>
      </div>
    </div>
  );
};
