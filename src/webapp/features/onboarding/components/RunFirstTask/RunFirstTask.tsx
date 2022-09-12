import React, { useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

import AddIconSvg from 'assets/svgs/onboarding/add-teal-icon.svg';
import CurrencySvgIcon from 'assets/svgs/onboarding/currency-teal-small-icon.svg';
import RestoreIconSvg from 'assets/svgs/onboarding/restore-orange-icon.svg';
import BgShape from 'assets/svgs/onboarding/shape_1.svg';
import { Button, ErrorMessage } from 'webapp/components';
import { AppRoute } from 'webapp/routing/AppRoutes';
import { startTask, stakeOnTask } from 'webapp/services';

import { useDefaultTasks } from '../../hooks';

import TaskItem from './TaskItem';

const RunFirstTask = () => {
  const navigate = useNavigate();
  const [selectedTasksKeys, setSelectedTasksKeys] = useState<string[]>([]);
  const [stakePerTask, setStakePerTask] = useState<Record<string, number>>({});
  const { defaultTasks, isLoading, error } = useDefaultTasks();

  const handleStakeInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    taskPubKey: string
  ) => {
    const { value } = e.target;

    setStakePerTask({
      ...stakePerTask,
      [taskPubKey]: Number(value),
    });
  };

  const handleRunTasks = async () => {
    const stakeOnTasksPromises = Object.entries(stakePerTask).map(
      ([taskPubKey, stake]) => stakeOnTask(taskPubKey, stake)
    );

    /**
     * @dev staking in each individua task before we continue
     */
    await Promise.all(stakeOnTasksPromises);
    const promises = selectedTasks.map(({ publicKey }) => startTask(publicKey));
    await Promise.all(promises);
  };

  const handleTaskRemove = (taskPubKey: string) => {
    const newTasks = selectedTasksKeys.filter(
      (pubKey) => pubKey !== taskPubKey
    );
    setSelectedTasksKeys(newTasks);
  };

  const handleRestoreTasks = async () => {
    setStakePerTask({});
    setSelectedTasksKeys(defaultTasks.map(({ publicKey }) => publicKey));
  };

  const runTasksMutation = useMutation(handleRunTasks, {
    onSuccess: () => {
      navigate(AppRoute.OnboardingConfirmStake);
    },
  });

  const totalStaked = useMemo(
    () => Object.values(stakePerTask).reduce((acc, curr) => acc + curr, 0),
    [stakePerTask]
  );

  const noTasks = selectedTasksKeys.length === 0;
  const selectedTasks = defaultTasks.filter((task) =>
    selectedTasksKeys.includes(task.publicKey)
  );

  return (
    <div className="relative h-full overflow-hidden bg-finnieBlue-dark-secondary">
      <div className="px-8">
        <div className="text-lg mt-[90px] mb-[50px]">
          Start running verified tasks with just one click
        </div>

        <div className="flex flex-row mb-2 text-xs text-finnieTeal">
          <div className="w-[214px] ml-[64px]">Task Name</div>
          <div className="w-[112px] pl-4">Creator</div>
          <div className="w-[60px] pl-8">Level</div>
          <div className="pl-12">Stake</div>
        </div>

        <div className="h-[38vh] overflow-auto">
          <div className="py-2">
            {error ? (
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              <ErrorMessage errorMessage={error?.message as string} />
            ) : null}
            {runTasksMutation.error ? (
              <ErrorMessage
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                errorMessage={runTasksMutation?.error?.message as string}
              />
            ) : null}
          </div>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            selectedTasks.map((task, index) => (
              <div className="mb-4" key={index}>
                <TaskItem
                  stakeValue={stakePerTask[task.publicKey] ?? 0}
                  name={task.taskName}
                  creator={task.taskManager}
                  /**
                   * @todo: get difficulty level from API
                   */
                  level={'Low'}
                  minStake={25}
                  onStakeInputChange={(e) =>
                    handleStakeInputChange(e, task.publicKey)
                  }
                  onRemove={() => handleTaskRemove(task.publicKey)}
                />
              </div>
            ))
          )}
        </div>

        <div className="flex flex-row justify-between mt-4">
          <Button
            label="Customize my tasks"
            className="bg-transparent text-finnieEmerald-light"
            icon={<AddIconSvg />}
            onClick={() => navigate(AppRoute.AddTask)}
          />
          <Button
            label="Restore Original"
            className="bg-transparent text-finnieOrange"
            icon={<RestoreIconSvg />}
            onClick={handleRestoreTasks}
          />
        </div>

        <div className="flex justify-center mt-[40px]">
          <div className="flex flex-col items-center justify-center">
            <Button
              className="font-semibold bg-finnieGray-light text-finnieBlue-light w-[220px] h-[38px]"
              label="Run Tasks"
              disabled={runTasksMutation.isLoading || noTasks}
              onClick={() => runTasksMutation.mutate()}
            />
            <div className="flex flex-row items-center gap-2 mt-2 text-sm text-finnieEmerald-light">
              <CurrencySvgIcon className="h-[24px]" />
              {`Total staked: ${totalStaked} KOII`}
            </div>
          </div>
        </div>
      </div>
      <BgShape className="absolute top-0 right-0" />
    </div>
  );
};

export default RunFirstTask;
