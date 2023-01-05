import { Icon, CurrencyMoneyLine } from '@_koii/koii-styleguide';
import Lottie from 'lottie-react';
import React from 'react';
import CountUp from 'react-countup';

import confettiAnimation from 'assets/animations/confetti.json';
import FinnieKoiiLogo from 'assets/svgs/finnie-logos/finnie-koii-logo-inverse.svg';
import PendingRewardsIcon from 'assets/svgs/pending-rewards-icon.svg';
import { LoadingSpinner } from 'webapp/components';
import { usePrevious } from 'webapp/features/common';

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

export const StatBlock = ({
  value,
  type,
  isLoading,
  displayConfetti,
  shouldAnimate,
}: StatProps) => {
  const previousValue = usePrevious(value);

  const { label, IconComponent } = statContentByType[type];
  const isPendingRewardsBlock = type === 'pendingRewards';
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
      <div className="flex justify-between items-center">
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
      {shouldAnimate && (
        <Lottie
          animationData={confettiAnimation}
          loop={false}
          className="absolute -top-14 -right-6 w-40 h-40"
        />
      )}
    </div>
  );
};
