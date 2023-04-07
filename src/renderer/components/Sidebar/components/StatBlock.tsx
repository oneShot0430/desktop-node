import { Icon, CurrencyMoneyLine } from '@_koii/koii-styleguide';
import React from 'react';
import CountUp from 'react-countup';

import FinnieKoiiLogo from 'assets/svgs/finnie-logos/finnie-koii-logo-inverse.svg';
import PendingRewardsIcon from 'assets/svgs/pending-rewards-icon.svg';
import { LoadingSpinner } from 'renderer/components/ui/LoadingSpinner';
import { usePrevious } from 'renderer/features/common/hooks/usePrevious';

import { ClaimRewards } from './ClaimRewards';

const statContentByType = {
  totalKoii: {
    label: 'Total KOII',
    IconComponent: FinnieKoiiLogo,
  },
  totalStaked: {
    label: 'Total Staked',
    IconComponent: CurrencyMoneyLine,
  },
  pendingRewards: {
    label: 'Pending Rewards',
    IconComponent: PendingRewardsIcon,
  },
};

type StatProps = {
  value: number;
  type: 'totalKoii' | 'totalStaked' | 'pendingRewards';
  isLoading: boolean;
  displayConfetti?: () => void;
  shouldAnimate?: boolean;
};

export function StatBlock({
  value,
  type,
  isLoading,
  displayConfetti,
  shouldAnimate,
}: StatProps) {
  const previousValue = usePrevious(value);

  const { label, IconComponent } = statContentByType[type];
  const isPendingRewardsBlock = type === 'pendingRewards';
  // eslint-disable-next-line no-unsafe-optional-chaining
  const decimalsAmount = +String(value).split('.')[1]?.length;
  const statValue = isLoading ? (
    <LoadingSpinner className="ml-auto" />
  ) : shouldAnimate ? (
    <CountUp
      decimals={decimalsAmount}
      start={previousValue}
      end={value}
      duration={0.5}
    />
  ) : (
    value
  );

  return (
    <div
      className={`flex flex-col w-[186px] rounded bg-finnieBlue-light-secondary py-1.5 pl-2.5 pr-3.5 ${
        isPendingRewardsBlock ? 'h-28' : 'h-[60px]'
      }`}
    >
      <div className="flex items-center justify-between">
        <Icon source={IconComponent} className="text-white" />

        <div>
          <div className="text-right text-white">{statValue}</div>
          <div className="text-[14px] text-finnieTeal w-fit ml-auto">
            {label}
          </div>
        </div>
      </div>
      {isPendingRewardsBlock && (
        <ClaimRewards value={value} displayConfetti={displayConfetti} />
      )}
      {/* {shouldAnimate && (
        <div className="absolute w-40 h-40 -top-14 -right-6">
          <Confetti width={160} height={160} />
        </div>
      )} */}
    </div>
  );
}
