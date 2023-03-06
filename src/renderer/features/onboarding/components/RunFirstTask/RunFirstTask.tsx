import { Icon, AddFill, CurrencyMoneyLine } from '@_koii/koii-styleguide';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import RestoreIconSvg from 'assets/svgs/onboarding/restore-orange-icon.svg';
import BgShape from 'assets/svgs/onboarding/shape_1.svg';
import { Button } from 'renderer/components/ui';
import { AppRoute } from 'renderer/types/routes';
import { getKoiiFromRoe } from 'utils';

import { useRunFirstTasksLogic } from './hooks';
import TaskItem from './TaskItem';

function RunFirstTask() {
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

  const totalStakedInKoii = getKoiiFromRoe(totalStaked);

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
            <div className="col-start-2 col-span-5">Task Name</div>
            <div className="col-span-6">Creator</div>
            <div className="col-start-13 col-span-5 2xl:col-start-15 2xl:col-span-3">
              Stake
            </div>
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
                    minStake={minStake}
                    onStakeInputChange={(newStake) => {
                      handleStakeInputChange(newStake, publicKey);
                      setIsRunButtonDisabled(newStake < minStake);
                    }}
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
            icon={<Icon source={AddFill} />}
            onClick={handleCustomizeTasks}
          />
          <Button
            label="Restore Original"
            className="bg-transparent text-finnieOrange"
            icon={<Icon source={RestoreIconSvg} />}
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
            <Icon source={CurrencyMoneyLine} />
            {`Total staked: ${totalStakedInKoii} KOII`}
          </div>
        </div>
      </div>
      <BgShape className="absolute top-0 right-0" />
    </div>
  );
}

export default RunFirstTask;