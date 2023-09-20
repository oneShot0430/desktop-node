import React from 'react';

import CloseIcon from 'assets/svgs/cross-icon.svg';
import SearchIcon from 'assets/svgs/search.svg';
import UpdateIcon from 'assets/svgs/update-icon.svg';
import { Button, Placement, Tooltip } from 'renderer/components/ui';

interface UpgradeAvailableContentProps {
  onUpgrade: () => void;
  onReview: () => void;
  onAcknowledge: () => void;
  isFirstRowInTable: boolean;
  isCoolingDown: boolean;
}

export function UpgradeAvailableContent({
  onUpgrade,
  onReview,
  onAcknowledge,
  isFirstRowInTable,
  isCoolingDown,
}: UpgradeAvailableContentProps) {
  const upgradeNowButton = (
    <Button
      onClick={onUpgrade}
      icon={<UpdateIcon className="h-6 w-6 stroke-2" />}
      label="Upgrade Now"
      disabled={isCoolingDown}
      className="text-finnieBlue h-9 w-[162px] bg-white"
    />
  );
  const coolingDownTooltipPlacement: Placement = `${
    isFirstRowInTable ? 'bottom' : 'top'
  }-left`;

  return (
    <>
      <div className="whitespace-nowrap w-24 mr-auto">
        This task has an update.
      </div>
      <div className="ml-[50%]">
        <Button
          onClick={onReview}
          icon={<SearchIcon />}
          label="Review"
          className="border-2 border-white text-white h-9 w-[115px] bg-transparent"
        />
      </div>
      <div className="col-span-3 ml-10">
        {isCoolingDown ? (
          <Tooltip
            tooltipContent="The upgrade will be available after 3 rounds."
            placement={coolingDownTooltipPlacement}
          >
            {upgradeNowButton}
          </Tooltip>
        ) : (
          upgradeNowButton
        )}
      </div>
      <CloseIcon onClick={onAcknowledge} className="cursor-pointer" />
    </>
  );
}
