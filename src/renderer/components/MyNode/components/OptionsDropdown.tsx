import {
  Icon,
  RemoveLine,
  ShareArrowLine,
  TooltipChatQuestionLeftLine,
} from '@_koii/koii-styleguide';
import React from 'react';

import Archive from 'assets/svgs/archive.svg';
import CurrencyIcon from 'assets/svgs/currency.svg';
import Output from 'assets/svgs/output.svg';
import PauseCircle from 'assets/svgs/pause-circle.svg';
import PlayCircle from 'assets/svgs/play-circle.svg';
import { Tooltip } from 'renderer/components/ui';
import { useTaskStake } from 'renderer/features';
import { Task, TaskStatus } from 'renderer/types';
import { Theme } from 'renderer/types/common';

type PropsType = {
  addStake: () => void;
  unstake: () => void;
  runOrStopTask: () => void;
  openLogs: () => void;
  task: Task;
  status: TaskStatus;
  isInverted: boolean;
};

export function OptionsDropdown({
  addStake,
  unstake,
  runOrStopTask,
  openLogs,
  task,
  status,
  isInverted,
}: PropsType) {
  const isArchiveDisabled = true;
  const isCoolingDown = status === TaskStatus.COOLING_DOWN;
  const baseItemClasses = 'flex gap-2 text-white cursor-pointer';
  const containerClasses = `z-10 ${
    isInverted
      ? 'bg-[url(assets/svgs/options-bg-inverted.png)] -top-[217px] bg-bottom'
      : 'bg-[url(assets/svgs/options-bg.png)] top-12'
  }  bg-cover text-base absolute -right-[21px] w-[290px] h-[216px] pl-4 rounded-xl flex flex-col justify-evenly`;
  const disabledItemClasses = '!text-[#949494] !cursor-not-allowed';
  const unstakeWhenRunningMessage = (
    <span className="bg-gray-light/20 text-gray-light text-xs rounded p-1 ml-auto mr-2">
      <Icon
        source={ShareArrowLine}
        className="text-white h-2.5 w-2.5 rotate-90 scale-y-[-1] mr-1.5"
      />
      Stop Task to Unstake
    </span>
  );
  const unstakeWhenCoolingDownMessage = (
    <button
      onClick={unstake}
      className="bg-gray-light/20 text-gray-light text-xs rounded px-2 py-1 ml-auto mr-2"
    >
      Wait 3 rounds
      <Icon
        source={TooltipChatQuestionLeftLine}
        className="text-white w-4 h-3.5 ml-2"
      />
    </button>
  );

  const { taskStake } = useTaskStake({ task });

  return (
    <div className={containerClasses}>
      <button
        onClick={addStake}
        className={`${baseItemClasses} ${
          !task.isWhitelisted ? disabledItemClasses : ''
        }`}
        disabled={!task.isWhitelisted}
      >
        <Icon source={CurrencyIcon} className="text-white" />
        Add Stake
      </button>
      <button
        onClick={unstake}
        disabled={task.isRunning}
        className={`${baseItemClasses} ${
          task.isRunning || isCoolingDown ? disabledItemClasses : ''
        }`}
      >
        <Icon source={RemoveLine} />
        Unstake
        {task.isRunning
          ? unstakeWhenRunningMessage
          : isCoolingDown
          ? unstakeWhenCoolingDownMessage
          : null}
      </button>
      <button
        onClick={runOrStopTask}
        className={`${baseItemClasses} ${
          (!task.isRunning && !taskStake) || !task.isWhitelisted
            ? disabledItemClasses
            : ''
        }`}
        disabled={(!task.isRunning && !taskStake) || !task.isWhitelisted}
      >
        <Icon source={task.isRunning ? PauseCircle : PlayCircle} />
        {task.isRunning ? 'Stop Task' : 'Start Task'}
      </button>
      <Tooltip tooltipContent="Coming soon" theme={Theme.Light}>
        <button
          className={`${baseItemClasses} ${
            isArchiveDisabled ? disabledItemClasses : ''
          }`}
        >
          <Icon source={Archive} />
          Archive Task
        </button>
      </Tooltip>
      <button className={baseItemClasses} onClick={openLogs}>
        <Icon source={Output} />
        Output Logs
      </button>
    </div>
  );
}
