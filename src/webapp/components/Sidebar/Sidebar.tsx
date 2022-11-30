import React from 'react';
import { useQuery } from 'react-query';

import { getKoiiFromRoe } from 'utils';
import { useUserAppConfig } from 'webapp/features';
import {
  AppNotification,
  useNotificationsContext,
} from 'webapp/features/notifications';
import { getTaskNodeInfo, QueryKeys } from 'webapp/services';

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

  const totalEarnedInKoii = getKoiiFromRoe(data?.totalKOII);
  const totalStakedInKoii = getKoiiFromRoe(data?.totalStaked);
  const pendingRewardsInKoii = getKoiiFromRoe(data?.pendingRewards);

  return (
    <div className="flex flex-col pr-[22px] gap-[26px]">
      <Summary
        totalEarned={totalEarnedInKoii}
        totalStaked={totalStakedInKoii}
        pendingRewards={pendingRewardsInKoii}
        isLoading={isLoading}
      />
      <Actions />
    </div>
  );
};
