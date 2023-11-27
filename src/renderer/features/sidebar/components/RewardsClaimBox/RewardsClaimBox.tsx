import { Icon } from '@_koii/koii-styleguide';
import React from 'react';

import RewardIcon from 'assets/svgs/new/RewardIcon.svg';

import { CountKoii } from '../CountKoii';
import { InfoBox } from '../InfoBox';

import { ClaimRewardAction } from './ClaimRewardAction';

type PropsType = {
  onRewardClaimClick: () => void;
  rewardClaimable?: boolean;
  rewardsAmount?: number;
  isClaimingRewards?: boolean;
};

export function RewardsClaimBox({
  rewardsAmount = 0,
  rewardClaimable = false,
  onRewardClaimClick,
  isClaimingRewards,
}: PropsType) {
  return (
    <InfoBox className="flex flex-col items-center h-32 p-2 xl:p-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col items-start">
          <span className="text-sm text-green-2">Rewards</span>
          <span className="text-lg">
            <CountKoii value={rewardsAmount} />
          </span>
        </div>
        {/* TODO: replace with icon from styleguide, when available */}
        <Icon source={RewardIcon} size={48} aria-label="rewards icon" />
      </div>

      {rewardClaimable ? (
        <ClaimRewardAction
          isClaimingRewards={isClaimingRewards}
          onRewardClaimClick={onRewardClaimClick}
        />
      ) : (
        <span className="mt-auto text-sm">KOII coming your way...</span>
      )}
    </InfoBox>
  );
}
