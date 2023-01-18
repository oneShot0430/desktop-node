import { sum } from 'lodash';
import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import AddIconSvg from 'assets/svgs/onboarding/add-teal-icon.svg';
import CurrencySvgIcon from 'assets/svgs/onboarding/currency-teal-small-icon.svg';
import config from 'config';
import { getKoiiFromRoe } from 'utils';
import { ErrorMessage, Button } from 'renderer/components';
import {
  useNotEnoughFunds,
  useRunMultipleTasks,
} from 'renderer/features/common';
import {
  useMainAccountBalance,
  useUserAppConfig,
} from 'renderer/features/settings';
import { TaskWithStake } from 'renderer/types';
import { AppRoute } from 'renderer/types/routes';
import { ErrorContext } from 'renderer/utils';

import { SelectedTasksSummary } from './SelectedTasksSummary';

const { TASK_FEE } = config.node;

const ConfirmYourStake = () => {
  const navigate = useNavigate();
  const { state: selectedTasks } = useLocation();

  const [tasksToRun, setTasksToRun] = useState<TaskWithStake[]>(
    selectedTasks as TaskWithStake[]
  );
  const [isRunButtonDisabled, setIsRunButtonDisabled] = useState<boolean>();

  const { data: balance, isLoading } = useMainAccountBalance();
  const handleRunTasksSuccess = () =>
    handleSaveUserAppConfig({ settings: { onboardingCompleted: true } });

  const { runAllTasks, runTasksLoading, runTasksError } = useRunMultipleTasks({
    tasksToRun,
    onRunAllTasksSuccessCallback: handleRunTasksSuccess,
  });
  const { showNotEnoughFunds } = useNotEnoughFunds();
  const { handleSaveUserAppConfig } = useUserAppConfig({
    onConfigSaveSuccess: () =>
      navigate(AppRoute.MyNode, {
        state: { noBackButton: true },
      }),
  });

  const totalKoiiStaked = useMemo(
    () => getKoiiFromRoe(sum(tasksToRun.map((task) => task.stake))),
    [tasksToRun]
  );
  const tasksFee = TASK_FEE * tasksToRun.length;
  const tasksFeeInKoii = getKoiiFromRoe(tasksFee);
  const totalKoiiToUse = totalKoiiStaked + tasksFeeInKoii;

  const handleConfirm = () => {
    if (balance < totalKoiiToUse) {
      showNotEnoughFunds();
    } else {
      runAllTasks();
    }
  };

  const handleSelectMoreTasks = () => navigate(AppRoute.AddTask);

  const updateStake = (publicKey: string, newStake: number) => {
    const updatedTasks = tasksToRun.map((task) => {
      const updatedTask = {
        ...task,
        ...(task.publicKey === publicKey && { stake: newStake }),
      };

      return updatedTask;
    });

    setTasksToRun(updatedTasks);
  };

  return (
    <div className="relative h-full overflow-hidden bg-finnieBlue-dark-secondary">
      <div className="px-8">
        <div className="mt-[60px] mb-[50px] text-finnieEmerald-light text-2xl text-center">
          You&apos;re choosing to run:
        </div>

        <SelectedTasksSummary
          selectedTasks={tasksToRun}
          tasksFee={tasksFeeInKoii}
          updateStake={updateStake}
          setIsRunButtonDisabled={setIsRunButtonDisabled}
        />

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
              disabled={runTasksLoading || isRunButtonDisabled}
              onClick={handleConfirm}
            />
            {runTasksError?.map((error, index) => (
              <ErrorMessage
                key={index}
                error={error}
                context={ErrorContext.START_TASK}
              />
            ))}
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
