import React from 'react';

import { ExternalNotificationBanner } from '../Banners/ExternalNotificationBanner';
import { FirstNodeReward } from '../Banners/FirstNodeRewardBanner';
import { FirstTaskRunningNotification } from '../Banners/FirstTasksRunningNotification';
import { LowMainAccountBalanceNotification } from '../Banners/LowMainAccountBalanceNotification';
import { LowMainAccountBalanceSevereNotification } from '../Banners/LowMainAccountBalanceSevereNotification';
import { LowMainAccountBalanceSevereWithRewardsNotification } from '../Banners/LowMainAccountBalanceSevereWithRewardsNotification';
import { LowMainAccountBalanceWithRewardsNotification } from '../Banners/LowMainAccountBalanceWithRewardsNotification';
import { LowStakingAccountBalanceNotification } from '../Banners/LowStakingAccountBalanceNotification';
import { LowStakingAccountBalanceSevereNotification } from '../Banners/LowStakingAccountBalanceSevereNotification';
import { ReferralProgramNotification } from '../Banners/ReferralProgramNotification';
import { RentExemptionFlowBanner } from '../Banners/RentExemptionFlowBanner';
import { TaskUpgradeNotificationBanner } from '../Banners/TaskUpgradeNotificationBanner';
import { UpdateAvailableNotification } from '../Banners/UpdateAvailableNotification';
import { AppNotificationType, NotificationType } from '../types';

export const useNotificationComponent = ({
  notification,
  backButtonSlot,
}: {
  notification: NotificationType;
  backButtonSlot?: React.ReactNode;
}) => {
  const componentsMap: Record<AppNotificationType, JSX.Element | null> = {
    FIRST_NODE_REWARD: (
      <FirstNodeReward
        notification={notification}
        backButtonSlot={backButtonSlot}
      />
    ),
    FIRST_TASK_RUNNING: (
      <FirstTaskRunningNotification notification={notification} />
    ),
    REFERRAL_PROGRAM: (
      <ReferralProgramNotification
        notification={notification}
        backButtonSlot={backButtonSlot}
      />
    ),
    TOP_UP_MAIN_KEY: (
      <LowMainAccountBalanceNotification
        notification={notification}
        backButtonSlot={backButtonSlot}
      />
    ),
    TOP_UP_MAIN_KEY_CRITICAL: (
      <LowMainAccountBalanceSevereNotification
        notification={notification}
        backButtonSlot={backButtonSlot}
      />
    ),
    TOP_UP_MAIN_KEY_WITH_REWARDS: (
      <LowMainAccountBalanceWithRewardsNotification
        notification={notification}
        backButtonSlot={backButtonSlot}
      />
    ),
    TOP_UP_MAIN_KEY_CRITICAL_WITH_REWARDS: (
      <LowMainAccountBalanceSevereWithRewardsNotification
        notification={notification}
        backButtonSlot={backButtonSlot}
      />
    ),
    TOP_UP_STAKING_KEY: (
      <LowStakingAccountBalanceNotification
        notification={notification}
        backButtonSlot={backButtonSlot}
      />
    ),
    TOP_UP_STAKING_KEY_CRITICAL: (
      <LowStakingAccountBalanceSevereNotification
        notification={notification}
        backButtonSlot={backButtonSlot}
      />
    ),
    RUN_EXEMPTION_FLOW: (
      <RentExemptionFlowBanner
        notification={notification}
        backButtonSlot={backButtonSlot}
      />
    ),
    TASK_UPGRADE: (
      <TaskUpgradeNotificationBanner
        backButtonSlot={backButtonSlot}
        notification={notification}
        taskName={
          (notification?.metadata as { taskName: string })?.taskName ?? ''
        }
      />
    ),
    UPDATE_AVAILABLE: (
      <UpdateAvailableNotification
        notification={notification}
        backButtonSlot={backButtonSlot}
      />
    ),
    EXTERNAL_INFO: (
      <ExternalNotificationBanner
        notification={notification}
        backButtonSlot={backButtonSlot}
      />
    ),
    EXTERNAL_OFFER: (
      <ExternalNotificationBanner
        notification={notification}
        backButtonSlot={backButtonSlot}
      />
    ),
    NEW_TASK_AVAILABLE: null,
    TASK_BLACKLISTED_OR_REMOVED: null,
    TASK_OUT_OF_BOUNTY: null,
    BACKUP_SEED_PHRASE: null,
    COMPUTER_MAX_CAPACITY: null,
    CLAIMED_REWARD: null,
    FIRST_REWARD_ON_NEW_TASK: null,
    ARCHIVING_SUCCESSFUL: null,
    TASK_STARTED: null,
    SESSION_STARTED_FROM_SCHEDULER: null,
  };

  return (
    notification.appNotificationDataKey &&
    componentsMap[notification.appNotificationDataKey]
  );
};
