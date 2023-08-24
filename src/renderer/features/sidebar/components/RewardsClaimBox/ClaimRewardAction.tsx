import { Button, ButtonVariant, ButtonSize } from '@_koii/koii-styleguide';
import React from 'react';

import { DotsLoader, Tooltip } from 'renderer/components/ui';
import { Theme } from 'renderer/types/common';

type PropsType = {
  isClaimingRewards?: boolean;
  onRewardClaimClick: () => void;
};

export function ClaimRewardAction({
  isClaimingRewards = false,
  onRewardClaimClick,
}: PropsType) {
  return isClaimingRewards ? (
    <div className="pt-4">
      <DotsLoader />
    </div>
  ) : (
    <Tooltip
      theme={Theme.Light}
      tooltipContent="Click here to claim all pending Task rewards."
    >
      <Button
        variant={ButtonVariant.Secondary}
        size={ButtonSize.SM}
        buttonClassesOverrides="mt-3"
        label="Claim Rewards"
        data-testid="claim-rewards-button"
        onClick={onRewardClaimClick}
      />
    </Tooltip>
  );
}
