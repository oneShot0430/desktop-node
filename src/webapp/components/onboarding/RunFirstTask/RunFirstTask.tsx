import React from 'react';
import { useQuery } from 'react-query';

import AddIconSvg from 'assets/svgs/onboarding/add-teal-icon.svg';
import CurrencySvgIcon from 'assets/svgs/onboarding/currency-teal-small-icon.svg';
import RestoreIconSvg from 'assets/svgs/onboarding/restore-orange-icon.svg';
import BgShape from 'assets/svgs/onboarding/shape_1.svg';
import { Button } from 'webapp/components';
import { QueryKeys, fetchMyTasks } from 'webapp/services';

import TaskItem from './TaskItem';

const RunFirstTask = () => {
  const {
    isLoading,
    data: tasks,
    error,
  } = useQuery([QueryKeys.taskList], fetchMyTasks);

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
        {/* {JSON.stringify(tasks)} */}

        <div className="flex flex-row mb-2 text-xs text-finnieTeal">
          <div className="w-[214px] ml-[64px]">Task Name</div>
          <div className="w-[112px] pl-4">Creator</div>
          <div className="w-[60px] pl-8">Level</div>
          <div className="pl-12">Stake</div>
        </div>

        <div className="h-[38vh] overflow-auto">
          {new Array(5).fill(0).map((_, index) => (
            <div className="mb-4" key={index}>
              <TaskItem
                name={'Content collectives'}
                creator={'Koii Network'}
                level={'Low'}
                minStake={'25'}
              />
            </div>
          ))}
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
