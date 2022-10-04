import { sum } from 'lodash';
import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import AddIconSvg from 'assets/svgs/onboarding/add-teal-icon.svg';
import CurrencySvgIcon from 'assets/svgs/onboarding/currency-teal-small-icon.svg';
import { ErrorMessage } from 'webapp/components';
import { Button } from 'webapp/components/ui/Button';
import { useNotEnoughFunds, useRunMultipleTasks } from 'webapp/features/common';
import { useMainAccountBalance } from 'webapp/features/settings';
import { TaskWithStake } from 'webapp/types';

import { SelectedTasksSummary } from './SelectedTasksSummary';

const ConfirmYourStake = () => {
  const { state: selectedTasks } = useLocation();
  const tasksToRun = selectedTasks as TaskWithStake[];

  const { data: balance, isLoading } = useMainAccountBalance();
  const { runAllTasks, runTasksLoading, runTasksError } = useRunMultipleTasks({
    tasksToRun,
  });
  const { showNotEnoughFunds } = useNotEnoughFunds();

  const totalKoiiStaked = useMemo(
    () => sum(tasksToRun.map((task) => task.stake)),
    [tasksToRun]
  );

  const handleConfirm = () => {
    if (balance < totalKoiiStaked) {
      showNotEnoughFunds();
    } else {
      runAllTasks();
    }
  };

  return (
    <div className="relative h-full overflow-hidden bg-finnieBlue-dark-secondary">
      <div className="px-8">
        <div className="mt-[60px] mb-[50px] text-finnieEmerald-light text-2xl text-center">
          You&apos;re choosing to run:
        </div>

        <SelectedTasksSummary selectedTasks={tasksToRun} />

        <div className="flex justify-center mt-[40px]">
          <div className="flex flex-col items-center justify-center">
            <Button
              className="font-semibold bg-finnieGray-light text-finnieBlue-light w-[220px] h-[38px]"
              label={runTasksLoading ? 'Running tasks...' : 'Confirm'}
              disabled={runTasksLoading}
              onClick={handleConfirm}
            />
            {runTasksError ? (
              <ErrorMessage
                errorMessage={(runTasksError as { message: string }).message}
              />
            ) : null}
            <div className="flex flex-row items-center gap-2 mt-2 text-sm text-finnieEmerald-light">
              <CurrencySvgIcon className="h-[24px]" />
              {`Total balance: ${
                isLoading ? 'Loading balance...' : balance
              } KOII`}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-end pr-8 mt-3">
        <Button
          label="Select more tasks"
          className="bg-transparent text-finnieEmerald-light w-max"
          icon={<AddIconSvg />}
        />
      </div>
    </div>
  );
};

export default ConfirmYourStake;
