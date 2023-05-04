import React from 'react';
import { useQuery } from 'react-query';

import { NODE_INFO_REFETCH_INTERVAL } from 'config/refetchIntervals';
import {
  AppNotification,
  useNotificationsContext,
} from 'renderer/features/notifications';
import { getTaskNodeInfo, QueryKeys } from 'renderer/services';

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
      refetchInterval: NODE_INFO_REFETCH_INTERVAL,
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

  return (
    <div className="flex flex-col pr-[22px] gap-4">
      <Summary
        totalBalance={data?.totalKOII || 0}
        totalStaked={data?.totalStaked || 0}
        pendingRewards={data?.pendingRewards || 0}
        isLoading={isLoading}
      />
      <Actions />
    </div>
  );
}
