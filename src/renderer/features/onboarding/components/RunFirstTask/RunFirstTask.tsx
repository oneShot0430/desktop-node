import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import BgShape from 'assets/svgs/onboarding/shape_1.svg';
import config from 'config';
import { FundButton } from 'renderer/components/FundButton';
import { Button, ErrorMessage } from 'renderer/components/ui';
import {
  useRunMultipleTasks,
  useNotEnoughFunds,
} from 'renderer/features/common';
import { useAppNotifications } from 'renderer/features/notifications/hooks';
import {
  useMainAccountBalance,
  useUserAppConfig,
} from 'renderer/features/settings';
import { TaskWithStake } from 'renderer/types';
import { AppRoute } from 'renderer/types/routes';
import { ErrorContext } from 'renderer/utils';
import { getKoiiFromRoe } from 'utils';

import { useRunFirstTasksLogic } from './hooks';
import TaskItem from './TaskItem';

function RunFirstTask() {
  const [isRunButtonDisabled, setIsRunButtonDisabled] =
    useState<boolean>(false);
  const {
    selectedTasks,
    loadingVerifiedTasks,
    stakePerTask,
    totalStaked,
    handleStakeInputChange,
    handleTaskRemove,
  } = useRunFirstTasksLogic();

  const [tasksToRun, setTasksToRun] = useState(
    selectedTasks as TaskWithStake[]
  );
  const [showMinimumStakeError, setShowMinimumStakeError] =
    useState<boolean>(false);

  const { TASK_FEE } = config.node;

  const navigate = useNavigate();

  useEffect(() => {
    setTasksToRun(selectedTasks);
  }, [selectedTasks]);

  const { accountBalance: mainAccountBalance = 0, loadingAccountBalance } =
    useMainAccountBalance();
  const balanceInKoii = getKoiiFromRoe(mainAccountBalance);
  const totalStakeInKoii = useMemo(
    () => getKoiiFromRoe(totalStaked),
    [totalStaked]
  );

  const { handleSaveUserAppConfig } = useUserAppConfig({
    onConfigSaveSuccess: () =>
      navigate(AppRoute.MyNode, {
        state: { noBackButton: true },
      }),
  });
  const { addAppNotification: showFirstTaskRunningNotification } =
    useAppNotifications('FIRST_TASK_RUNNING');
  const { addAppNotification: showReferralProgramNotification } =
    useAppNotifications('REFERRAL_PROGRAM');
  const handleRunTasksSuccess = () => {
    handleSaveUserAppConfig({ settings: { onboardingCompleted: true } });
    showReferralProgramNotification();
    showFirstTaskRunningNotification();
  };

  const { runAllTasks, runTasksLoading, runTasksError } = useRunMultipleTasks({
    tasksToRun,
    onRunAllTasksSuccessCallback: handleRunTasksSuccess,
  });
  const tasksFee = TASK_FEE * tasksToRun.length;
  const tasksFeeInKoii = getKoiiFromRoe(tasksFee);
  const totalKoiiToUse = totalStakeInKoii + tasksFeeInKoii;
  const { showNotEnoughFunds } = useNotEnoughFunds();
  const handleConfirm = () => {
    if (balanceInKoii < totalKoiiToUse) {
      showNotEnoughFunds();
    } else {
      runAllTasks();
    }
  };
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
    <div className="relative flex-col items-center justify-center h-full bg-finnieBlue-dark-secondary">
      <div className="flex flex-col items-center justify-center h-full px-8 py-6">
        <div className="max-h-[90%] flex flex-col h-full w-full items-center justify-center">
          <div className="flex flex-col items-center justify-center w-full max-h-full text-center max-w-[960px]">
            <p className="mb-2 text-2xl leading-8 text-finnieEmerald-light">
              Get Started
            </p>
            <div className="text-base mb-5 text-center max-w-[587px]">
              After your node makes a submission, the stake is locked until
              three rounds after the task is paused. This task has a round time
              of about 10 minutes.
            </div>
            <div className="grid w-full mb-1 text-xs text-left grid-cols-first-task text-finnieEmerald-light">
              <div className="col-span-2 mx-auto ">Info</div>
              <div className="col-span-6 ">Task</div>
              <div className="col-span-6">Creator</div>
              <div className="col-span-4 2xl:col-start-15 2xl:col-span-4">
                Stake
              </div>
            </div>
            <div className="max-h-[80%] min-h-[40%] w-full h-full overflow-x-hidden overflow-y-auto z-0">
              {loadingVerifiedTasks ? (
                <div>Loading...</div>
              ) : (
                selectedTasks.map((task, index) => (
                  <div className="w-full h-auto pb-2" key={index}>
                    <TaskItem
                      stakeValue={stakePerTask[task?.publicKey] ?? 0}
                      onStakeInputChange={(newStake) => {
                        handleStakeInputChange(newStake, task.publicKey);
                        updateStake(task.publicKey, newStake);
                        setIsRunButtonDisabled(newStake < task.minStake);
                      }}
                      onRemove={() => handleTaskRemove(task.publicKey)}
                      index={index}
                      task={task}
                      setShowMinimumStakeError={setShowMinimumStakeError}
                    />
                  </div>
                ))
              )}
            </div>
            <div className="flex items-center justify-between w-full px-4 mt-1 text-base font-semibold leading-5">
              <div className="flex gap-2">
                <p className="text-orange-2">Task Fees</p>
                <p>~0.01 KOII</p>
              </div>
              <div className="flex gap-2">
                <p className="text-finnieEmerald-light">Total KOII staked</p>
                <p>{totalStakeInKoii} KOII</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center h-[10%] mt-auto">
          <div className="flex flex-row items-center gap-2 mb-1.5 text-sm text-finnieEmerald-light">
            {`Total balance: ${
              loadingAccountBalance ? 'Loading balance...' : balanceInKoii
            } KOII`}
            <FundButton />
          </div>
          <Button
            className="font-semibold bg-finnieGray-light text-finnieBlue-light w-56 h-[38px]"
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
          {showMinimumStakeError && (
            <p className="pt-1 text-xs text-finnieRed">
              Whoops! Make sure you stake at least 1.9 KOII on this task.
            </p>
          )}
        </div>
      </div>
      <BgShape className="absolute top-0 right-0" />
    </div>
  );
}

export default RunFirstTask;
