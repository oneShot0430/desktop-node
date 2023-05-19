/* eslint-disable react/no-unescaped-entities */
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

import { useRentExemptionFlow } from 'renderer/features/common/hooks/useRentExemptionFlow';
import { AppRoute } from 'renderer/types/routes';

import { useNotificationsContext } from '../context';
import { AppNotification } from '../types';

export function FirstNodeReward({
  backButtonSlot,
  id,
}: {
  backButtonSlot?: React.ReactNode;
  id: string;
}) {
  const navigate = useNavigate();
  const { removeNotificationById, addNotification } = useNotificationsContext();
  const { getStakingWalletAirdrop } = useRentExemptionFlow();

  const handleShowRentExemptionFlowNotification = useCallback(async () => {
    await getStakingWalletAirdrop()
      .then((res) => {
        console.log(res.message);
        addNotification('runExemptionFlow', AppNotification.RunExemptionFlow);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [addNotification, getStakingWalletAirdrop]);

  const handleSeeTasksAction = useCallback(() => {
    removeNotificationById(id);
    navigate(AppRoute.AddTask);
    handleShowRentExemptionFlowNotification();
  }, [
    handleShowRentExemptionFlowNotification,
    id,
    navigate,
    removeNotificationById,
  ]);

  const handleClose = useCallback(() => {
    handleShowRentExemptionFlowNotification();
    removeNotificationById(id);
  }, [handleShowRentExemptionFlowNotification, id, removeNotificationById]);

  const classNames = twMerge(
    'flex justify-between w-full px-4 mx-auto px-4 items-center gap-4',
    'bg-green-2 text-finnieBlue'
  );

  return (
    <div className={classNames}>
      {backButtonSlot}
      <div className="max-w-[65%]">
        You've earned your first node reward! Run more tasks to easily increase
        your rewards.
      </div>
      <div className="flex items-center gap-6 w-max">
        <Button
          label="See tasks"
          onClick={handleSeeTasksAction}
          variant={ButtonVariant.PrimaryDark}
          size={ButtonSize.MD}
          labelClassesOverrides="font-semibold w-max"
          buttonClassesOverrides="bg-finnieBlue"
        />

        <button className="cursor-pointer" title="close" onClick={handleClose}>
          <Icon source={CloseLine} className="h-9 w-9" />
        </button>
      </div>
    </div>
  );
}
