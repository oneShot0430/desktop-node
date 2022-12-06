// import { Button, ButtonSize } from '@_koii/koii-styleguide';
import React, { useState } from 'react';
// import { useQueryClient } from 'react-query';

import FinnieKoiiLogo from 'assets/svgs/finnie-logos/finnie-koii-logo-inverse.svg';
import TotalStakedIcon from 'assets/svgs/koii-staked-icon.svg';
import PendingRewardsIcon from 'assets/svgs/pending-rewards-icon.svg';
// import { GetTaskNodeInfoResponse } from 'models/api';
// import { QueryKeys } from 'webapp/services';

import { StatBlock } from './StatBlock';

type SummaryProps = {
  totalEarned: number;
  totalStaked: number;
  pendingRewards: number;
  isLoading: boolean;
};

export const Summary = ({
  totalEarned,
  totalStaked,
  pendingRewards,
  isLoading,
}: SummaryProps) => {
  const [shouldAnimate, setShouldAnimate] = useState<boolean>(false);

  // const queryClient = useQueryClient();

  const displayConfetti = () => {
    setShouldAnimate(true);
    setTimeout(() => {
      setShouldAnimate(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col gap-4 relative">
      <StatBlock
        value={totalEarned}
        label="Total KOII"
        iconSlot={<FinnieKoiiLogo />}
        isLoading={isLoading}
        shouldAnimate={shouldAnimate}
      />
      <StatBlock
        value={totalStaked}
        label="Total Staked"
        iconSlot={<TotalStakedIcon />}
        isLoading={isLoading}
      />
      <StatBlock
        value={pendingRewards}
        label="Pending Rewards"
        iconSlot={<PendingRewardsIcon />}
        isLoading={isLoading}
        displayConfetti={displayConfetti}
        shouldAnimate={shouldAnimate}
      />
      {/* Mock for testing purposes while reviewing PR, will be deleted before merging  */}

      {/* <div className="absolute left-[130%] -top-1/4 w-fit">
        <Button
          label="Simulate pending rewards"
          size={ButtonSize.SM}
          buttonClassesOverrides="!p-6"
          onClick={() => {
            queryClient.setQueryData(
              [QueryKeys.taskNodeInfo],
              (oldNodeData: GetTaskNodeInfoResponse) => {
                const newNodeInfodata = {
                  ...oldNodeData,
                  pendingRewards: 10000000000,
                };

                return newNodeInfodata;
              }
            );
          }}
        />
      </div> */}
    </div>
  );
};
