import React from 'react';
import { useQuery } from 'react-query';

import { useUserAppConfig } from 'renderer/features/common';
import {
  AppNotification,
  useNotificationsContext,
} from 'renderer/features/notifications';
import { getTaskNodeInfo, QueryKeys } from 'renderer/services';
import { getKoiiFromRoe } from 'utils';

import { Actions } from './components/Actions';
import { Summary } from './components/Summary';

export const Sidebar = () => {
  const { addNotification } = useNotificationsContext();
  const { userConfig, handleSaveUserAppConfig } = useUserAppConfig({});
  const firstRewardNotificationDisplayed =
    !!userConfig?.firstRewardNotificationDisplayed;

  const { data, isLoading } = useQuery(
    [QueryKeys.taskNodeInfo],
    getTaskNodeInfo,
    {
      refetchInterval: 1000 * 60 * 5,
      onSettled: ({ pendingRewards }) => {
        if (pendingRewards > 0 && !firstRewardNotificationDisplayed) {
          // set notification for very first node reward
          addNotification(AppNotification.FirstNodeReward);
          handleSaveUserAppConfig({
            settings: {
              firstRewardNotificationDisplayed: true,
            },
          });
        }
      },
    }
  );

  const totalBalanceInKoii = getKoiiFromRoe(data?.totalKOII);
  const totalStakedInKoii = getKoiiFromRoe(data?.totalStaked);
  const pendingRewardsInKoii = getKoiiFromRoe(data?.pendingRewards);

  return (
    <div className="flex flex-col pr-[22px] gap-4">
      <Summary
        totalKoii={totalBalanceInKoii}
        totalStaked={totalStakedInKoii}
        pendingRewards={pendingRewardsInKoii}
        isLoading={isLoading}
      />
      <Actions />
    </div>
  );
};
