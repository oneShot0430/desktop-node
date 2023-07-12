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
import {
  useNotificationsContext,
  AppNotification,
  NotificationPlacement,
} from 'renderer/features/notifications';
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

  const { data: mainAccountBalance = 0, isLoading } = useMainAccountBalance();
  const balanceInKoii = getKoiiFromRoe(mainAccountBalance);
  const totalStakeInKoii = useMemo(
    () => getKoiiFromRoe(totalStaked),
    [totalStaked]
  );

  const { addNotification } = useNotificationsContext();
  const { handleSaveUserAppConfig } = useUserAppConfig({
    onConfigSaveSuccess: () =>
      navigate(AppRoute.MyNode, {
        state: { noBackButton: true },
      }),
  });
  const handleRunTasksSuccess = () => {
    handleSaveUserAppConfig({ settings: { onboardingCompleted: true } });
    addNotification(
      'referralProgramNotification',
      AppNotification.ReferalProgramNotification,
      NotificationPlacement.TopBar
    );
    addNotification(
      'firstTaskRunningNotification',
      AppNotification.FirstTaskRunningNotification,
      NotificationPlacement.Bottom
    );
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
    <div className="relative h-full flex-col justify-center items-center bg-finnieBlue-dark-secondary">
      <div className="px-8 py-6 h-full flex flex-col items-center justify-center">
        <div className="max-h-[90%] flex flex-col h-full w-full items-center justify-center">
          <div className="w-full max-h-full flex flex-col items-center justify-center text-center">
            <p className="text-2xl leading-8 mb-2 text-finnieEmerald-light">
              Get Started
            </p>
            <div className="text-base mb-5 text-center max-w-[587px]">
              After your node makes a submission, the stake is locked until
              three rounds after the task is paused. This task has a round time
              of about 10 minutes.
            </div>
            <div className="mb-1 text-xs text-left w-full grid grid-cols-first-task text-finnieEmerald-light">
              <div className=" col-span-2 mx-auto">Info</div>
              <div className=" col-span-6">Task</div>
              <div className="col-span-6">Creator</div>
              <div className=" col-span-4 2xl:col-start-15 2xl:col-span-4">
                Stake
              </div>
            </div>
            <div className="max-h-[80%] min-h-[40%] w-full h-full overflow-x-hidden overflow-y-auto">
              {loadingVerifiedTasks ? (
                <div>Loading...</div>
              ) : (
                selectedTasks.map((task, index) => (
                  <div className="pb-2 w-full h-auto" key={index}>
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
            <div className="flex justify-between w-full mt-1 font-semibold text-base leading-5 px-4 items-center">
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
              isLoading ? 'Loading balance...' : balanceInKoii
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
            <p className="pt-1 text-finnieRed text-xs">
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
