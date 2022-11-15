import React from 'react';

import FinnieKoiiLogo from 'assets/svgs/finnie-logos/finnie-koii-logo-inverse.svg';
import TotalStakedIcon from 'assets/svgs/koii-staked-icon.svg';
import PendingRewardsIcon from 'assets/svgs/pending-rewards-icon.svg';

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
  return (
    <div className="flex flex-col gap-[26px]">
      <StatBlock
        value={totalEarned}
        label={'Total KOII'}
        iconSlot={<FinnieKoiiLogo />}
        isLoading={isLoading}
      />
      <StatBlock
        value={totalStaked}
        label={'Total Staked'}
        iconSlot={<TotalStakedIcon />}
        isLoading={isLoading}
      />
      <StatBlock
        value={pendingRewards}
        label={'Pending Rewards'}
        iconSlot={<PendingRewardsIcon />}
        isLoading={isLoading}
      />
    </div>
  );
};
