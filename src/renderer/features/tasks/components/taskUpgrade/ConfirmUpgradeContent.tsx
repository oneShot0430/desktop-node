import React, { useState } from 'react';

import UpdateIcon from 'assets/svgs/update-icon.svg';
import { CRITICAL_MAIN_ACCOUNT_BALANCE } from 'config/node';
import { ROE } from 'models';
import { Button, EditStakeInput, LoadingSpinner } from 'renderer/components/ui';
import { Popover } from 'renderer/components/ui/Popover/Popover';
import { useFundNewAccountModal } from 'renderer/features/common';
import {
  useMainAccount,
  useMainAccountBalance,
} from 'renderer/features/settings';
import { SettingsButton } from 'renderer/features/tasks/components/AdvancedOptions/AddPrivateTask/SettingsButton';
import { Theme } from 'renderer/types/common';
import { getKoiiFromRoe } from 'utils';

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
  const [stake, setStake] = useState(minStake);
  const { data: accountPublicKey } = useMainAccount();
  const { accountBalance = 0 } = useMainAccountBalance();
  const meetsMinimumStake = stake >= minStake;
  const hasEnoughKoii = accountBalance >= stake + CRITICAL_MAIN_ACCOUNT_BALANCE;
  const isUpgradeButtonDisabled =
    (hasVariablesToUpgrade && !isTaskSettingsValid) ||
    !meetsMinimumStake ||
    !hasEnoughKoii;
  const confirmUpgrade = () => onUpgrade(stake);
  const { showModal: showFundModal } = useFundNewAccountModal({
    accountPublicKey,
  });

  const getErrorMessage = () => {
    const conditions = [
      {
        condition: hasEnoughKoii,
        errorMessage: 'have enough KOII to stake',
        action: showFundModal,
      },
      {
        condition: meetsMinimumStake,
        errorMessage: `stake at least ${getKoiiFromRoe(
          minStake
        )} KOII on this Task`,
      },
      {
        condition: isTaskSettingsValid,
        errorMessage: 'configure the Task extensions',
        action: openSettings,
      },
    ];

    const errors = conditions
      .filter(({ condition }) => !condition)
      .map(({ errorMessage, action }) => ({ errorMessage, action }));

    if (errors.length === 0) {
      return '';
    } else if (errors.length === 1) {
      return (
        <div>
          Make sure you{' '}
          {errors[0].action ? (
            <button
              onClick={errors[0].action}
              className="font-semibold text-finnieTeal-100 hover:underline"
            >
              {errors[0].errorMessage}.
            </button>
          ) : (
            <>{errors[0].errorMessage}.</>
          )}
        </div>
      );
    } else {
      const errorList = errors.map(({ errorMessage, action }) => (
        <li key={errorMessage}>
          •{' '}
          {action ? (
            <button
              onClick={action}
              className="font-semibold text-finnieTeal-100 hover:underline"
            >
              {errorMessage}
            </button>
          ) : (
            errorMessage
          )}
        </li>
      ));
      return (
        <div>
          Make sure you:
          <br />
          <ul> {errorList}</ul>
        </div>
      );
    }
  };

  const errorMessage = getErrorMessage();

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
              meetsMinimumStake={meetsMinimumStake && hasEnoughKoii}
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
            <Popover
              theme={Theme.Dark}
              tooltipContent={errorMessage}
              isHidden={!isUpgradeButtonDisabled}
            >
              <Button
                onClick={confirmUpgrade}
                icon={<UpdateIcon className="h-6 w-6 stroke-2" />}
                label="Upgrade"
                className="text-finnieBlue h-9 w-32 bg-white"
                disabled={isUpgradeButtonDisabled}
              />
            </Popover>
          </div>
        </>
      )}
    </>
  );
}
