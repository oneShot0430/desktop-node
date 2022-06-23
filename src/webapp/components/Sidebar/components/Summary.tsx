import * as React from 'react';

import FinnieKoiiLogo from 'assets/svgs/finnie-logos/finnie-koii-logo-inverse.svg';
import TotalStakedIcon from 'assets/svgs/koii-staked-icon.svg';
import PendingRewardsIcon from 'assets/svgs/pending-rewards-icon.svg';

import { StatBlock } from './StatBlock';

type SummaryProps = {
  totalEarned: number;
  totalStaked: number;
  pendingRewards: number;
};

export const Summary = ({
  totalEarned,
  totalStaked,
  pendingRewards,
}: SummaryProps) => {
  return (
    <div className="flex flex-col gap-[26px]">
      <StatBlock
        value={totalEarned}
        label={'Total KOII'}
        iconSlot={<FinnieKoiiLogo />}
      />
      <StatBlock
        value={totalStaked}
        label={'Total Staked'}
        iconSlot={<TotalStakedIcon />}
      />
      <StatBlock
        value={pendingRewards}
        label={'Pending Rewards'}
        iconSlot={<PendingRewardsIcon />}
      />
    </div>
  );
};
