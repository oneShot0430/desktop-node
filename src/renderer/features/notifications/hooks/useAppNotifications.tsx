import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppRoute } from 'renderer/types/routes';
// eslint-disable-next-line @cspell/spellchecker
import { v4 as uuidv4 } from 'uuid';

import { useRunExemptionFlowModal } from '../../common';
import { useFundStakingAccountModal } from '../../common/hooks/useFundStakingAccountModal';
import { useMainAccount } from '../../settings';
import { AppNotificationsMap } from '../appNotificationsMap';
import { AppUpdateButton } from '../NotificationsCenter/components/AppUpdateButton';
import { CTAButton } from '../NotificationsCenter/components/CTAButton';
import { AppNotificationType, NotificationType } from '../types';
import { useNotificationActions } from '../useNotificationStore';

import { useFirstNodeRewardLogic } from './useFirstNodeRewardLogic';

export const useAppNotifications = (
  notificationTypeName: AppNotificationType
) => {
  const randomUuid = uuidv4();
  const { addNotification, removeNotification, markAsRead } =
    useNotificationActions();
  const { data: mainAccount } = useMainAccount();
  const { showModal: showFundStakingAccountModal } = useFundStakingAccountModal(
    {
      onWalletFundSuccess: () => {
        // TODO: implement
      },
    }
  );
  const { showModal: showExemptionFlowModal } = useRunExemptionFlowModal();
  const { handleSeeTasksAction } = useFirstNodeRewardLogic();
  const navigate = useNavigate();

  const getNotificationActionComponent = (notification: NotificationType) => {
    const componentsMap: Record<AppNotificationType, JSX.Element> = {
      FIRST_TASK_RUNNING: (
        <CTAButton
          label="Run more Tasks"
          onClick={() => {
            navigate(AppRoute.AddTask);
            markAsRead(notification.id);
          }}
        />
      ),
      REFERRAL_PROGRAM: (
        <CTAButton
          label="Learn more"
          onClick={() => {
            navigate(AppRoute.SettingsGeneral);
            markAsRead(notification.id);
          }}
        />
      ),
      TOP_UP_STAKING_KEY: (
        <CTAButton
          label="Top Up Staking Key"
          onClick={() => {
            showFundStakingAccountModal();
            markAsRead(notification.id);
          }}
        />
      ),
      TOP_UP_STAKING_KEY_CRITICAL: (
        <CTAButton
          label="Top Up Staking Key"
          onClick={() => {
            showFundStakingAccountModal();
            markAsRead(notification.id);
          }}
        />
      ),
      RUN_EXEMPTION_FLOW: (
        <CTAButton
          label="Rent Exemption Flow"
          onClick={() => {
            showExemptionFlowModal();
            markAsRead(notification.id);
          }}
        />
      ),
      FIRST_NODE_REWARD: (
        <CTAButton
          label="See tasks"
          onClick={() => {
            handleSeeTasksAction(notification.id);
          }}
        />
      ),
      TASK_UPGRADE: (
        <CTAButton
          label="Upgrade in My Node"
          onClick={() => {
            navigate(AppRoute.MyNode);
            markAsRead(notification.id);
          }}
        />
      ),
      NEW_TASK_AVAILABLE: (
        <CTAButton
          label="implement me"
          onClick={() => {
            throw new Error('Function not implemented.');
          }}
        />
      ),
      TASK_BLACKLISTED_OR_REMOVED: (
        <CTAButton
          label="implement me"
          onClick={() => {
            throw new Error('Function not implemented.');
          }}
        />
      ),
      TASK_OUT_OF_BOUNTY: (
        <CTAButton
          label="implement me"
          onClick={() => {
            throw new Error('Function not implemented.');
          }}
        />
      ),
      BACKUP_SEED_PHRASE: (
        <CTAButton
          label="implement me"
          onClick={() => {
            throw new Error('Function not implemented.');
          }}
        />
      ),
      COMPUTER_MAX_CAPACITY: (
        <CTAButton
          label="implement me"
          onClick={() => {
            throw new Error('Function not implemented.');
          }}
        />
      ),
      CLAIMED_REWARD: (
        <CTAButton
          label="implement me"
          onClick={() => {
            throw new Error('Function not implemented.');
          }}
        />
      ),
      FIRST_REWARD_ON_NEW_TASK: (
        <CTAButton
          label="implement me"
          onClick={() => {
            throw new Error('Function not implemented.');
          }}
        />
      ),
      UPDATE_AVAILABLE: <AppUpdateButton notificationId={notification.id} />,
      ARCHIVING_SUCCESSFUL: (
        <CTAButton
          label="implement me"
          onClick={() => {
            throw new Error('Function not implemented.');
          }}
        />
      ),
      SESSION_STARTED_FROM_SCHEDULER: (
        <CTAButton
          label="implement me"
          onClick={() => {
            throw new Error('Function not implemented.');
          }}
        />
      ),
      TASK_STARTED: (
        <CTAButton
          label="implement me"
          onClick={() => {
            throw new Error('Function not implemented.');
          }}
        />
      ),
      EXTERNAL_INFO: (
        <CTAButton
          label={notification.ctaText ?? 'Learn more'}
          onClick={() => {
            if (notification.ctaLink) {
              window.open(notification.ctaLink, '_blank');
              markAsRead(notification.id);
            }
          }}
        />
      ),
      EXTERNAL_OFFER: (
        <CTAButton
          label={notification.ctaText ?? 'Learn more'}
          onClick={() => {
            if (notification.ctaLink) {
              window.open(notification.ctaLink, '_blank');
              markAsRead(notification.id);
            }
          }}
        />
      ),
    };

    return notification.appNotificationDataKey
      ? componentsMap[notification.appNotificationDataKey]
      : null;
  };

  const notificationData = useMemo(
    () => AppNotificationsMap[notificationTypeName],
    [notificationTypeName]
  );

  if (!notificationData) {
    // throw new Error(
    //   `No notification data found for notification type ${notificationTypeName}`
    // );
    console.error(
      `No notification data found for notification type ${notificationTypeName}`
    );
  }

  function addAppNotification(metadata?: Record<string, unknown>) {
    const notification: NotificationType = {
      id: randomUuid,
      date: Date.now(),
      read: false,
      accountPubKey: mainAccount ?? '',
      appNotificationDataKey: notificationTypeName,
      variant: notificationData.variant ?? 'INFO',
      metadata,
    };

    if (!mainAccount) return;
    addNotification(notification);
  }

  return {
    markAsRead,
    addAppNotification,
    removeNotification,
    notificationDetails: notificationData,
    getNotificationActionComponent,
  };
};
