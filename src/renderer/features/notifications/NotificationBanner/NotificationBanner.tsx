import { Icon, CloseLine, Button, ButtonSize } from '@_koii/koii-styleguide';
import React from 'react';

import { BackButton } from '../../../components/BackButton';
import { AppNotification, useNotificationsContext } from '../context';

type PropsType = {
  notification: AppNotification;
};

export function NotificationBanner({
  notification: { message, buttonLabel, action },
}: PropsType) {
  const { removeNotification } = useNotificationsContext();

  const executeActionAndClose = () => {
    removeNotification();
    action();
  };

  return (
    <div className="flex justify-between w-full px-3 mx-auto items-center gap-4 bg-green-2 text-finnieBlue">
      <BackButton color="blue" />
      <div className="text-right w-full">{message}</div>
      <div className="flex items-center gap-4 w-max">
        <Button
          label={buttonLabel}
          onClick={executeActionAndClose}
          size={ButtonSize.SM}
          labelClassesOverrides="font-semibold w-max"
          buttonClassesOverrides="px-2 bg-transparent text-purple-3 border-2 border-purple-3 hover:bg-purple-3 hover:text-white"
        />

        <button
          className="cursor-pointer"
          title="close"
          onClick={removeNotification}
        >
          <Icon source={CloseLine} className="h-5.5 w-5.5" />
        </button>
      </div>
    </div>
  );
}
