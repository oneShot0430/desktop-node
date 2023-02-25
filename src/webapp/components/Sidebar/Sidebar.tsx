import React from 'react';
import { useQuery } from 'react-query';

import { getKoiiFromRoe } from 'utils';
import {
  AppNotification,
  useNotificationsContext,
} from 'webapp/features/notifications';
import { getTaskNodeInfo, QueryKeys } from 'webapp/services';

import { useUserAppConfig } from '../../features/common/hooks/useUserAppConfig';

import { Actions } from './components/Actions';
import { Summary } from './components/Summary';

export function Sidebar() {
  const { addNotification } = useNotificationsContext();
  const { userConfig, handleSaveUserAppConfig } = useUserAppConfig({});
  const firstRewardNotificationDisplayed =
    !!userConfig?.firstRewardNotificationDisplayed;

  const { data, isLoading } = useQuery(
    [QueryKeys.taskNodeInfo],
    getTaskNodeInfo,
    {
      refetchInterval: 1000 * 60 * 5,
      onSettled: (nodeInfo) => {
        if (
          (nodeInfo?.pendingRewards as number) > 0 &&
          !firstRewardNotificationDisplayed
        ) {
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

  const totalBalanceInKoii = getKoiiFromRoe(data?.totalKOII as number);
  const totalStakedInKoii = getKoiiFromRoe(data?.totalStaked as number);
  const pendingRewardsInKoii = getKoiiFromRoe(data?.pendingRewards as number);

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
}
