import { sum } from 'lodash';
import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import AddIconSvg from 'assets/svgs/onboarding/add-teal-icon.svg';
import CurrencySvgIcon from 'assets/svgs/onboarding/currency-teal-small-icon.svg';
import config from 'config';
import { ErrorMessage } from 'webapp/components';
import { Button } from 'webapp/components/ui/Button';
import { useNotEnoughFunds, useRunMultipleTasks } from 'webapp/features/common';
import { useMainAccountBalance } from 'webapp/features/settings';
import { AppRoute } from 'webapp/routing/AppRoutes';
import { TaskWithStake } from 'webapp/types';

import { SelectedTasksSummary } from './SelectedTasksSummary';

const { TASK_FEE } = config.node;

const ConfirmYourStake = () => {
  const navigate = useNavigate();
  const { state: selectedTasks } = useLocation();
  const tasksToRun = selectedTasks as TaskWithStake[];
  const handleRunTasksSuccess = () => navigate(AppRoute.MyNode);

  const { data: balance, isLoading } = useMainAccountBalance();
  const { runAllTasks, runTasksLoading, runTasksError } = useRunMultipleTasks({
    tasksToRun,
    onRunAllTasksSuccessCallback: handleRunTasksSuccess,
  });
  const { showNotEnoughFunds } = useNotEnoughFunds();

  const totalKoiiStaked = useMemo(
    () => sum(tasksToRun.map((task) => task.stake)),
    [tasksToRun]
  );
  const tasksFee = TASK_FEE * tasksToRun.length;
  const totalKoiiToSpend = totalKoiiStaked + tasksFee;

  const handleConfirm = () => {
    if (balance < totalKoiiToSpend) {
      showNotEnoughFunds();
    } else {
      runAllTasks();
    }
  };

  const handleSelectMoreTasks = () => navigate(AppRoute.AddTask);

  return (
    <div className="relative h-full overflow-hidden bg-finnieBlue-dark-secondary">
      <div className="px-8">
        <div className="mt-[60px] mb-[50px] text-finnieEmerald-light text-2xl text-center">
          You&apos;re choosing to run:
        </div>

        <SelectedTasksSummary selectedTasks={tasksToRun} tasksFee={tasksFee} />

        <div className="flex justify-center mt-[40px]">
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-row items-center gap-2 mb-2 text-sm text-finnieEmerald-light">
              <CurrencySvgIcon className="h-[24px]" />
              {`Total balance: ${
                isLoading ? 'Loading balance...' : balance
              } KOII`}
            </div>
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
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-end pr-8 mt-3">
        <Button
          label="Select more tasks"
          className="bg-transparent text-finnieEmerald-light w-max"
          icon={<AddIconSvg />}
          onClick={handleSelectMoreTasks}
        />
      </div>
    </div>
  );
};

export default ConfirmYourStake;
