import React, { useState } from 'react';
import { useQuery } from 'react-query';

import { NODE_INFO_REFETCH_INTERVAL } from 'config/refetchIntervals';
import { useUserAppConfig } from 'renderer/features';
import {
  AppNotification,
  useNotificationsContext,
} from 'renderer/features/notifications';
import { QueryKeys, getTaskNodeInfo } from 'renderer/services';

import { StatBlock } from './StatBlock';

export function Summary() {
  const { addNotification } = useNotificationsContext();
  const [enableQuery, setEnableQuery] = useState(true);
  const { userConfig, handleSaveUserAppConfig } = useUserAppConfig({});
  const firstRewardNotificationDisplayed =
    !!userConfig?.firstRewardNotificationDisplayed;

  const { data, isLoading } = useQuery(
    [QueryKeys.taskNodeInfo],
    getTaskNodeInfo,
    {
      enabled: enableQuery,
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

  const [shouldAnimate, setShouldAnimate] = useState<boolean>(false);

  const displayConfetti = () => {
    setShouldAnimate(true);
    setTimeout(() => {
      setShouldAnimate(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col gap-4 relative">
      <StatBlock
        value={data?.totalKOII ?? 0}
        type="totalKoii"
        isLoading={isLoading}
        shouldAnimate={shouldAnimate}
      />
      <StatBlock
        value={data?.totalStaked ?? 0}
        type="totalStaked"
        isLoading={isLoading}
      />
      <StatBlock
        value={data?.pendingRewards ?? 0}
        type="pendingRewards"
        isLoading={isLoading}
        displayConfetti={displayConfetti}
        shouldAnimate={shouldAnimate}
        enableNodeInfoRefetch={setEnableQuery}
      />
    </div>
  );
}
