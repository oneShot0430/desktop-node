import React from 'react';
import { useQuery } from 'react-query';

import { getKoiiFromRoe } from 'utils';
import { LoadingSpinner } from 'webapp/components/ui';
import { getTaskNodeInfo, QueryKeys } from 'webapp/services';

import { Actions } from './components/Actions';
import { Summary } from './components/Summary';

export const Sidebar = () => {
  const { data, isLoading } = useQuery(
    [QueryKeys.nodeTaskInfo],
    getTaskNodeInfo
  );

  const totalEarnedInKoii = isLoading ? (
    <LoadingSpinner className="ml-auto" />
  ) : (
    getKoiiFromRoe(data?.totalKOII)
  );
  const totalStakedInKoii = isLoading ? (
    <LoadingSpinner className="ml-auto" />
  ) : (
    getKoiiFromRoe(data?.totalStaked)
  );
  const pendingRewardsInKoii = isLoading ? (
    <LoadingSpinner className="ml-auto" />
  ) : (
    getKoiiFromRoe(data?.pendingRewards)
  );

  return (
    <div className="flex flex-col pr-[22px] gap-[26px]">
      <Summary
        totalEarned={totalEarnedInKoii}
        totalStaked={totalStakedInKoii}
        pendingRewards={pendingRewardsInKoii}
      />
      <Actions />
    </div>
  );
};
