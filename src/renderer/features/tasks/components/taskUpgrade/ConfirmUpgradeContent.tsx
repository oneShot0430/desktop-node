import React, { useState } from 'react';

import UpdateIcon from 'assets/svgs/update-icon.svg';
import { CRITICAL_MAIN_ACCOUNT_BALANCE } from 'config/node';
import { ROE } from 'models';
import { Button, EditStakeInput, LoadingSpinner } from 'renderer/components/ui';
import { useMainAccountBalance } from 'renderer/features/settings';
import { SettingsButton } from 'renderer/features/tasks/components/AdvancedOptions/AddPrivateTask/SettingsButton';

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
  const { accountBalance = 0 } = useMainAccountBalance();
  const meetsMinimumStake =
    stake >= minStake &&
    accountBalance >= stake + CRITICAL_MAIN_ACCOUNT_BALANCE;
  const isUpgradeButtonDisabled =
    (hasVariablesToUpgrade && !isTaskSettingsValid) || !meetsMinimumStake;
  const confirmUpgrade = () => onUpgrade(stake);

  return (
    <>
      <div className="whitespace-nowrap mx-auto col-span-3">
        Confirm task upgrade
      </div>
      {isLoadingNewVersion ? (
        <LoadingSpinner />
      ) : (
        <>
          <div
            className={`col-span-2 ml-auto ${
              hasVariablesToUpgrade ? 'ml-8' : ''
            }`}
          >
            <EditStakeInput
              meetsMinimumStake={meetsMinimumStake}
              stake={newStake || stake}
              defaultValue={newStake || stake}
              minStake={minStake}
              onChange={(stake) => setStake(stake)}
              disabled={!!newStake}
            />
          </div>
          <div className="col-span-1">
            {hasVariablesToUpgrade && (
              <SettingsButton
                isTaskToolsValid={isTaskSettingsValid}
                globalAndTaskVariables={taskVariables}
                onToggleView={openSettings}
                hasInvertedTooltip={isFirstRowInTable}
              />
            )}
          </div>
          <div className="col-span-1">
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
