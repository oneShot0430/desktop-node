import React from 'react';
import { useQuery } from 'react-query';

import { getKoiiFromRoe } from 'utils';
import { getTaskNodeInfo, QueryKeys } from 'webapp/services';

import { Actions } from './components/Actions';
import { Summary } from './components/Summary';

export const Sidebar = () => {
  const { data, isLoading } = useQuery(
    [QueryKeys.taskNodeInfo],
    getTaskNodeInfo
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
