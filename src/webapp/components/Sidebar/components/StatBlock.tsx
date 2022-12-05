import React, { ReactNode } from 'react';

import ShareIcon from 'assets/svgs/share-icon.svg';
import { LoadingSpinner } from 'webapp/components';

import { ClaimRewards } from './ClaimRewards';

type SummaryProps = {
  value: number;
  label: string;
  iconSlot: ReactNode;
  isLoading: boolean;
  displayConfetti?: () => void;
};

export const StatBlock = ({
  value,
  label,
  iconSlot,
  isLoading,
  displayConfetti,
}: SummaryProps) => {
  const statValue = isLoading ? <LoadingSpinner className="ml-auto" /> : value;

  const isPendingRewardsBlock = label === 'Pending Rewards';

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
      {isPendingRewardsBlock &&
        (value ? (
          <ClaimRewards displayConfetti={displayConfetti} />
        ) : (
          <div className="w-full m-2 mt-6 flex text-white items-center text-sm">
            Add a Task to Earn <ShareIcon className="w-8 h-8" />
          </div>
        ))}
    </div>
  );
};
