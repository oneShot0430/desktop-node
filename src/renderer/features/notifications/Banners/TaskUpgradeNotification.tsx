import { Icon, CloseLine, Button, ButtonSize } from '@_koii/koii-styleguide';
import React, { ReactNode } from 'react';

import { useNotificationsContext } from '../context';

interface TaskUpgradePayload {
  ctaButtonAction?: () => void;
  closeButtonAction?: () => void;
  taskName: string;
}

interface Props {
  id: string;
  backButtonSlot?: ReactNode;
  payload: TaskUpgradePayload;
}

export function TaskUpgradeNotification({
  id,
  backButtonSlot,
  payload,
}: Props) {
  const { removeNotificationById } = useNotificationsContext();

  const close = () => {
    payload?.closeButtonAction?.();
    removeNotificationById(id);
  };
  const onCTAClick = () => {
    console.log('running action', { payload });
    payload?.ctaButtonAction?.();
    close();
  };

  return (
    <div className="flex justify-end w-full px-4 mx-auto items-center gap-3 bg-finnieEmerald-light text-finnieBlue">
      <div className="mr-auto">{backButtonSlot}</div>

      <div className="max-w-[65%]">
        Task {payload?.taskName} is now available to upgrade!
      </div>
      <div className="flex items-center gap-4 w-max">
        <Button
          label="Upgrade Now"
          onClick={onCTAClick}
          size={ButtonSize.SM}
          labelClassesOverrides="font-semibold w-max"
          buttonClassesOverrides="px-2 bg-transparent text-purple-3 border-2 border-purple-3 hover:bg-purple-3 hover:text-white"
        />

        <button className="cursor-pointer" title="close" onClick={close}>
          <Icon source={CloseLine} className="h-5.5 w-5.5" />
        </button>
      </div>
    </div>
  );
}
