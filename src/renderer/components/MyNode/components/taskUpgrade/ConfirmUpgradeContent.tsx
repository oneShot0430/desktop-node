import React, { useState } from 'react';

import UpdateIcon from 'assets/svgs/update-icon.svg';
import { ROE } from 'models';
import { SettingsButton } from 'renderer/components/AvailableTasks/components/AdvancedOptions/AddPrivateTask/SettingsButton';
import { Button, EditStakeInput, LoadingSpinner } from 'renderer/components/ui';

interface ConfirmUpgradeContentProps {
  onUpgrade: (stake: number) => void;
  originalStake: ROE;
  newStake: ROE;
  minStake: ROE;
  isLoadingNewVersion: boolean;
  hasVariablesToUpgrade: boolean;
  taskVariables: any;
  openSettings: () => void;
  isTaskSettingsValid: boolean;
  isFirstRowInTable: boolean;
}

export function ConfirmUpgradeContent({
  onUpgrade,
  originalStake,
  newStake,
  minStake,
  isLoadingNewVersion,
  hasVariablesToUpgrade,
  taskVariables,
  openSettings,
  isTaskSettingsValid,
  isFirstRowInTable,
}: ConfirmUpgradeContentProps) {
  const [stake, setStake] = useState(originalStake);
  const isUpgradeButtonDisabled =
    (hasVariablesToUpgrade && !isTaskSettingsValid) || newStake !== 0
      ? newStake < minStake
      : stake < minStake;
  const confirmUpgrade = () => onUpgrade(stake);
  const mainMessageClasses = `whitespace-nowrap mr-auto ${
    hasVariablesToUpgrade ? 'col-span-1' : 'col-span-2'
  }`;

  return (
    <>
      <div className={mainMessageClasses}>Confirm task upgrade</div>
      {isLoadingNewVersion ? (
        <LoadingSpinner />
      ) : (
        <>
          <div className={hasVariablesToUpgrade ? 'ml-8' : '-mr-10 -ml-10'}>
            <EditStakeInput
              meetsMinimumStake={!isUpgradeButtonDisabled}
              stake={newStake || stake}
              defaultValue={newStake || stake}
              minStake={minStake}
              onChange={(stake) => setStake(stake)}
              disabled={!!newStake}
            />
          </div>
          {hasVariablesToUpgrade && (
            <SettingsButton
              isTaskToolsValid={isTaskSettingsValid}
              globalAndTaskVariables={taskVariables}
              onToggleView={openSettings}
              hasInvertedTooltip={isFirstRowInTable}
            />
          )}
          <div className="col-span-3">
            <Button
              onClick={confirmUpgrade}
              icon={<UpdateIcon className="h-6 w-6 stroke-2" />}
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
