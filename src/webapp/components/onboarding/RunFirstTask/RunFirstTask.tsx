import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

import AddIconSvg from 'assets/svgs/onboarding/add-teal-icon.svg';
import CurrencySvgIcon from 'assets/svgs/onboarding/currency-teal-small-icon.svg';
import RestoreIconSvg from 'assets/svgs/onboarding/restore-orange-icon.svg';
import BgShape from 'assets/svgs/onboarding/shape_1.svg';
import { Button, ErrorMessage } from 'webapp/components';
import { AppRoute } from 'webapp/routing/AppRoutes';
import { getTasksById, QueryKeys } from 'webapp/services';

import TaskItem from './TaskItem';

const defaultTasks = ['7mjiYZJvjmtDXF1TAnV5Cy1rLgXcQMqEpeYJYwEhrRyt'];

const RunFirstTask = () => {
  const {
    isLoading,
    data: tasks,
    error,
  } = useQuery(
    [
      QueryKeys.taskList,
      {
        tasksIds: defaultTasks,
      },
    ],
    () => getTasksById(defaultTasks)
  );
  const navigate = useNavigate();
  const [stakePerTask, setStakePerTask] = useState<Record<string, number>>({});

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

  const handleRunTasks = () => {
    console.log('### handleRunTasks');

    navigate(AppRoute.OnboardingConfirmStake);
  };

  console.log('firsd task', tasks);

  /**
   * @todo: mocked, get from the api
   */
  const totalStaked = 220;

  return (
    <div className="relative h-full overflow-hidden bg-finnieBlue-dark-secondary">
      <div className="px-8">
        <div className="text-lg mt-[90px] mb-[50px]">
          Start running verified tasks with just one click{' '}
        </div>

        <div className="flex flex-row mb-2 text-xs text-finnieTeal">
          <div className="w-[214px] ml-[64px]">Task Name</div>
          <div className="w-[112px] pl-4">Creator</div>
          <div className="w-[60px] pl-8">Level</div>
          <div className="pl-12">Stake</div>
        </div>

        <div className="h-[38vh] overflow-auto">
          {error ? <ErrorMessage errorMessage={error as string} /> : null}
          {isLoading ? (
            <div>loader</div>
          ) : (
            tasks.map((task, index) => (
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
          />
          <Button
            label="Restore Original"
            className="bg-transparent text-finnieOrange"
            icon={<RestoreIconSvg />}
          />
        </div>

        <div className="flex justify-center mt-[40px]">
          <div className="flex flex-col items-center justify-center">
            <Button
              className="font-semibold bg-finnieGray-light text-finnieBlue-light w-[220px] h-[38px]"
              label="Run Tasks"
              onClick={handleRunTasks}
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
