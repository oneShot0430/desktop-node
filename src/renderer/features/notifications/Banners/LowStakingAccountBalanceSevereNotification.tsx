/* eslint-disable react/no-unescaped-entities */
import { Icon, CloseLine } from '@_koii/koii-styleguide';
import React, { useCallback } from 'react';
import { twMerge } from 'tailwind-merge';

import { useNotificationsContext } from '../context';

import { FundStakingAccountButton } from './components/FundStakingAccountButton';

export function LowStakingAccountBalanceSevereNotification({
  backButtonSlot,
  id,
}: {
  backButtonSlot?: React.ReactNode;
  id: string;
}) {
  const { removeNotificationById } = useNotificationsContext();

  const handleClose = useCallback(() => {
    removeNotificationById(id);
  }, [id, removeNotificationById]);

  const classNames = twMerge(
    'flex justify-between w-full px-4 mx-auto px-4 items-center gap-4',
    'bg-finnieRed text-finnieBlue'
  );

  return (
    <div className={classNames}>
      {backButtonSlot}
      <div className="max-w-[65%]">
        Your staking key is below 1 KOII. Fund now to keep your node in the
        network.
      </div>
      <div className="flex items-center gap-6 w-max">
        <FundStakingAccountButton />

        <button className="cursor-pointer" title="close" onClick={handleClose}>
          <Icon source={CloseLine} className="h-5.5 w-5.5" />
        </button>
      </div>
    </div>
  );
}
