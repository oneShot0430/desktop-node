import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AddIconSvg from 'assets/svgs/onboarding/add-teal-icon.svg';
import CurrencySvgIcon from 'assets/svgs/onboarding/currency-teal-small-icon.svg';
import RestoreIconSvg from 'assets/svgs/onboarding/restore-orange-icon.svg';
import BgShape from 'assets/svgs/onboarding/shape_1.svg';
import { Button } from 'webapp/components';
import { AppRoute } from 'webapp/routing/AppRoutes';

import { useRunFirstTasksLogic } from './hooks';
import TaskItem from './TaskItem';

const RunFirstTask = () => {
  const [isRunButtonDisabled, setIsRunButtonDisabled] = useState<boolean>(true);

  const navigate = useNavigate();
  const {
    selectedTasks,
    loadingVerifiedTasks,
    stakePerTask,
    totalStaked,
    handleStakeInputChange,
    handleTaskRemove,
    handleRestoreTasks,
  } = useRunFirstTasksLogic();

  const handleContinue = () =>
    navigate(AppRoute.OnboardingConfirmStake, { state: selectedTasks });
  const handleCustomizeTasks = () => navigate(AppRoute.AddTask);

  return (
    <div className="relative h-full overflow-hidden bg-finnieBlue-dark-secondary">
      <div className="px-8 h-full flex flex-col">
        <div className="text-lg mt-20 mb-12">
          Start running verified tasks with just one click
        </div>
        <div className="overflow-x-auto">
          <div className="mb-2 text-xs text-left w-full grid grid-cols-first-task">
            <div className="col-start-2 col-span-4">Task Name</div>
            <div className="col-span-4">Creator</div>
            <div className="col-span-2">Level</div>
            <div className="col-span-1">Stake</div>
          </div>

          {loadingVerifiedTasks ? (
            <div>Loading...</div>
          ) : (
            selectedTasks.map(
              ({ publicKey, taskName, taskManager, minStake }, index) => (
                <div className="mb-4" key={index}>
                  <TaskItem
                    stakeValue={stakePerTask[publicKey] ?? 0}
                    name={taskName}
                    creator={taskManager}
                    /**
                     * @todo: get difficulty level from API
                     */
                    level={'Low'}
                    minStake={minStake}
                    onStakeInputChange={(e) =>
                      handleStakeInputChange(e, publicKey)
                    }
                    onRemove={() => handleTaskRemove(publicKey)}
                  />
                </div>
              )
            )
          )}
        </div>

        <div className="flex flex-row justify-between pl-2.5 mt-4">
          <Button
            label="Customize my tasks"
            className="bg-transparent text-finnieEmerald-light w-fit"
            icon={<AddIconSvg />}
            onClick={handleCustomizeTasks}
          />
          <Button
            label="Restore Original"
            className="bg-transparent text-finnieOrange"
            icon={<RestoreIconSvg />}
            onClick={handleRestoreTasks}
          />
        </div>
        <div className="flex flex-col items-center mt-auto mb-6">
          <Button
            className="font-semibold bg-finnieGray-light text-finnieBlue-light w-56 h-[38px]"
            label="Run Tasks"
            disabled={isRunButtonDisabled}
            onClick={handleContinue}
          />
          <div className="flex flex-row items-center gap-2 mt-2 text-sm text-finnieEmerald-light">
            <CurrencySvgIcon className="h-6" />
            {`Total staked: ${totalStaked} KOII`}
          </div>
        </div>
      </div>
      <BgShape className="absolute top-0 right-0" />
    </div>
  );
};

export default RunFirstTask;
