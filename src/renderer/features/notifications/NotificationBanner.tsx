import React from 'react';

import { FirstNodeReward } from './Banners/FirstNodeRewardBanner';
import { FirstTaskRunningNotification } from './Banners/FirstTasksRunningNotification';
import { ReferalProgramNotification } from './Banners/ReferalProgramNotification';
import { RentExemptionFlowBanner } from './Banners/RentExemptionFlowBanner';
import { UpdateAvailableNotification } from './Banners/UpdateAvailableNotification';
import { AppNotification } from './types';

type PropsType = {
  variant: AppNotification;
  backButtonComponent?: React.ReactNode;
  id: string;
};

export function NotificationBanner({
  variant,
  backButtonComponent,
  id,
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
  };

  return banners[variant];
}
