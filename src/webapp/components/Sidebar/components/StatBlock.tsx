import Lottie from 'lottie-react';
import React, { ReactNode } from 'react';
import CountUp from 'react-countup';

import confettiAnimation from 'assets/animations/confetti.json';
import { LoadingSpinner } from 'webapp/components';
import { usePrevious } from 'webapp/features/common';

import { ClaimRewards } from './ClaimRewards';

type SummaryProps = {
  value: number;
  label: string;
  iconSlot: ReactNode;
  isLoading: boolean;
  displayConfetti?: () => void;
  shouldAnimate?: boolean;
};

export const StatBlock = ({
  value,
  label,
  iconSlot,
  isLoading,
  displayConfetti,
  shouldAnimate,
}: SummaryProps) => {
  const previousValue = usePrevious(value);

  const isPendingRewardsBlock = label === 'Pending Rewards';
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
        isPendingRewardsBlock ? 'h-[112px]' : 'h-[60px]'
      }`}
    >
      <div className="flex justify-between items-center">
        <div>{iconSlot}</div>
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
