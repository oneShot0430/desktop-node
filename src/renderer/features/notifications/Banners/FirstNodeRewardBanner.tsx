/* eslint-disable react/no-unescaped-entities */
import { Button, ButtonSize, ButtonVariant } from '@_koii/koii-styleguide';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { useRentExemptionFlow } from 'renderer/features/common/hooks/useRentExemptionFlow';
import { AppRoute } from 'renderer/types/routes';

import { useAppNotifications } from '../hooks';
import { NotificationType } from '../types';
// import { useNotificationActions } from '../useNotificationStore';

import { NotificationDisplayBanner } from './components/NotificationDisplayBanner';

export function FirstNodeReward({
  notification,
  backButtonSlot,
}: {
  notification: NotificationType;
  backButtonSlot: React.ReactNode;
}) {
  const navigate = useNavigate();
  const { getStakingWalletAirdrop } = useRentExemptionFlow();

  const { addAppNotification: runExemptionFlowNotification, markAsRead } =
    useAppNotifications('RUN_EXEMPTION_FLOW');

  const handleShowRentExemptionFlowNotification = useCallback(async () => {
    await getStakingWalletAirdrop()
      .then((res) => {
        console.log(res.message);
        runExemptionFlowNotification();
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [getStakingWalletAirdrop, runExemptionFlowNotification]);

  const handleSeeTasksAction = useCallback(() => {
    markAsRead(notification.id);
    navigate(AppRoute.AddTask);
    handleShowRentExemptionFlowNotification();
  }, [
    handleShowRentExemptionFlowNotification,
    navigate,
    notification.id,
    markAsRead,
  ]);

  const handleClose = useCallback(() => {
    handleShowRentExemptionFlowNotification();
  }, [handleShowRentExemptionFlowNotification]);

  return (
    <NotificationDisplayBanner
      onClose={handleClose}
      notification={notification}
      messageSlot={
        <div className="max-w-[65%]">
          You've earned your first node reward! Run more tasks to easily
          increase your rewards.
        </div>
      }
      actionButtonSlot={
        <div className="flex items-center gap-6 w-max">
          <Button
            label="See tasks"
            onClick={handleSeeTasksAction}
            variant={ButtonVariant.PrimaryDark}
            size={ButtonSize.MD}
            labelClassesOverrides="font-semibold w-max"
            buttonClassesOverrides="bg-finnieBlue"
          />
        </div>
      }
      backButtonSlot={backButtonSlot}
    />
  );
}
