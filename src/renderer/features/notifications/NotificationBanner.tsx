import React from 'react';

import { FirstNodeReward } from './Banners/FirstNodeRewardBanner';
import { FirstTaskRunningNotification } from './Banners/FirstTasksRunningNotification';
import { LowStakingAccountBalanceNotification } from './Banners/LowStakingAccountBalanceNotification';
import { LowStakingAccountBalanceSevereNotification } from './Banners/LowStakingAccountBalanceSevereNotification';
import { ReferalProgramNotification } from './Banners/ReferalProgramNotification';
import { RentExemptionFlowBanner } from './Banners/RentExemptionFlowBanner';
import { TaskUpgradeNotification } from './Banners/TaskUpgradeNotification';
import { UpdateAvailableNotification } from './Banners/UpdateAvailableNotification';
import { AppNotification } from './types';

type PropsType = {
  variant: AppNotification;
  backButtonComponent?: React.ReactNode;
  id: string;
  payload?: any;
};

export function NotificationBanner({
  variant,
  backButtonComponent,
  id,
  payload,
}: PropsType) {
  const banners = {
    [AppNotification.FirstNodeReward]: (
      <FirstNodeReward backButtonSlot={backButtonComponent} id={id} />
    ),
    [AppNotification.RunExemptionFlow]: (
      <RentExemptionFlowBanner backButtonSlot={backButtonComponent} id={id} />
    ),
    [AppNotification.ReferralProgramNotification]: (
      <ReferalProgramNotification
        backButtonSlot={backButtonComponent}
        id={id}
      />
    ),
    [AppNotification.UpdateAvailable]: (
      <UpdateAvailableNotification
        backButtonSlot={backButtonComponent}
        id={id}
      />
    ),
    [AppNotification.FirstTaskRunningNotification]: (
      <FirstTaskRunningNotification id={id} />
    ),
    [AppNotification.TaskUpgradeNotification]: (
      <TaskUpgradeNotification
        backButtonSlot={backButtonComponent}
        id={id}
        payload={payload}
      />
    ),
    [AppNotification.LowStakingAccountBalance]: (
      <LowStakingAccountBalanceNotification
        backButtonSlot={backButtonComponent}
        id={id}
      />
    ),
    [AppNotification.LowStakingAccountBalanceSevere]: (
      <LowStakingAccountBalanceSevereNotification
        backButtonSlot={backButtonComponent}
        id={id}
      />
    ),
  };

  return banners[variant];
}
