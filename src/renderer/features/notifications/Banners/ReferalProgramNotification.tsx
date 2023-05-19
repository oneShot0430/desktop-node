import { Icon, CloseLine, Button, ButtonSize } from '@_koii/koii-styleguide';
import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppRoute } from 'renderer/types/routes';

import { useNotificationsContext } from '../context';

export function ReferalProgramNotification({
  id,
  backButtonSlot,
}: {
  id: string;
  backButtonSlot?: ReactNode;
}) {
  const { removeNotificationById } = useNotificationsContext();
  const navigate = useNavigate();

  const close = () => removeNotificationById(id);
  const onCTAClick = () => {
    navigate(AppRoute.Settings);
    close();
  };

  return (
    <div className="flex justify-end w-full px-4 mx-auto items-center gap-3 bg-finnieTeal text-finnieBlue">
      <div className="mr-auto">{backButtonSlot}</div>

      <div className="max-w-[65%]">
        Refer a friend and win 5 extra tokens for each person who joins the
        network.
      </div>
      <div className="flex items-center gap-4 w-max">
        <Button
          label="Get the Code"
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
