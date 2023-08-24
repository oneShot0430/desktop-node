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
    <InfoBox className="flex flex-col items-center p-2 h-28">
      <div className="flex items-center justify-between w-full">
        {/* TODO: replace with icon from styleguide, when available */}
        <Icon source={RewardIcon} size={36} aria-label="rewards icon" />
        <div className="flex flex-col items-end">
          <span className="text-lg">
            <CountKoii value={rewardsAmount} />
          </span>
          <span className="text-sm text-green-2">Rewards</span>
        </div>
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
