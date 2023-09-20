import React, { useState } from 'react';

import UpdateIcon from 'assets/svgs/update-icon.svg';
import { ROE } from 'models';
import { Button, EditStakeInput, LoadingSpinner } from 'renderer/components/ui';

interface ConfirmUpgradeContentProps {
  onUpgrade: (stake: number) => void;
  originalStake: ROE;
  newStake: ROE;
  minStake: ROE;
  isLoadingNewVersion: boolean;
}

export function ConfirmUpgradeContent({
  onUpgrade,
  originalStake,
  newStake,
  minStake,
  isLoadingNewVersion,
}: ConfirmUpgradeContentProps) {
  const [stake, setStake] = useState(originalStake);
  const isUpgradeButtonDisabled =
    newStake !== 0 ? newStake < minStake : stake < minStake;
  const confirmUpgrade = () => onUpgrade(stake);

  return (
    <>
      <div className="col-span-2 whitespace-nowrap mr-auto">
        Confirm task upgrade
      </div>
      {isLoadingNewVersion ? (
        <LoadingSpinner />
      ) : (
        <>
          <div>
            <EditStakeInput
              meetsMinimumStake={!isUpgradeButtonDisabled}
              stake={newStake || stake}
              defaultValue={newStake || stake}
              minStake={minStake}
              onChange={(stake) => setStake(stake)}
              disabled={!!newStake}
            />
          </div>
          <div className="col-span-3">
            <Button
              onClick={confirmUpgrade}
              icon={<UpdateIcon className="h-6 w-6" />}
              label="Upgrade"
              className="text-finnieBlue h-9 w-32 bg-white"
              disabled={isUpgradeButtonDisabled}
            />
          </div>
        </>
      )}
    </>
  );
}
