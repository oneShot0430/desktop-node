import React, { useState } from 'react';

import { StatBlock } from './StatBlock';

type SummaryProps = {
  totalBalance: number;
  totalStaked: number;
  pendingRewards: number;
  isLoading: boolean;
};

export function Summary({
  totalBalance,
  totalStaked,
  pendingRewards,
  isLoading,
}: SummaryProps) {
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
        value={totalBalance}
        type="totalKoii"
        isLoading={isLoading}
        shouldAnimate={shouldAnimate}
      />
      <StatBlock value={totalStaked} type="totalStaked" isLoading={isLoading} />
      <StatBlock
        value={pendingRewards}
        type="pendingRewards"
        isLoading={isLoading}
        displayConfetti={displayConfetti}
        shouldAnimate={shouldAnimate}
      />
    </div>
  );
}
