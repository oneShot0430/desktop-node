import {
  Icon,
  RemoveLine,
  TooltipChatQuestionLeftLine,
} from '@_koii/koii-styleguide';
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';

import Archive from 'assets/svgs/archive.svg';
import CurrencyIcon from 'assets/svgs/currency.svg';
import Output from 'assets/svgs/output.svg';
import PauseCircle from 'assets/svgs/pause-circle.svg';
import PlayCircle from 'assets/svgs/play-circle.svg';
import {
  useStakingAccount,
  useTaskStake,
  useUnstakingAvailability,
} from 'renderer/features';
import {
  QueryKeys,
  archiveTask as archiveTaskService,
} from 'renderer/services';
import { Task } from 'renderer/types';

type PropsType = {
  addStake: () => void;
  unstake: () => void;
  runOrStopTask: () => void;
  openLogs: () => void;
  task: Task;
  isInverted: boolean;
};

export function OptionsDropdown({
  addStake,
  unstake,
  runOrStopTask,
  openLogs,
  task,
  isInverted,
}: PropsType) {
  const queryCache = useQueryClient();

  const { mutate: archiveTask } = useMutation(
    () => archiveTaskService(task.publicKey),
    {
      onSuccess: () => queryCache.invalidateQueries([QueryKeys.taskList]),
    }
  );

  const { taskStake } = useTaskStake({ task });

  const { data: stakingAccountPublicKey = '' } = useStakingAccount();

  const { canUnstake } = useUnstakingAvailability({
    task,
    stakingAccountPublicKey,
  });

  const isRunPauseButtonDisabled =
    !task.isRunning && (!taskStake || !task.isWhitelisted);
  const isArchiveDisabled = task.isRunning || !!taskStake;
  const baseItemClasses = 'flex gap-2 text-white cursor-pointer';
  const containerClasses = `z-10 ${
    isInverted
      ? 'bg-[url(assets/svgs/options-bg-inverted.png)] -top-[217px] bg-bottom'
      : 'bg-[url(assets/svgs/options-bg.png)] top-12'
  }  bg-cover text-base absolute -right-[21px] w-[290px] h-[216px] pl-4 rounded-xl flex flex-col justify-evenly`;
  const disabledItemClasses = '!text-[#949494] !cursor-not-allowed';
  const baseHintClasses =
    'bg-gray-light/20 text-gray-light text-xs rounded p-1 ml-auto mr-2';
  const unstakeWhenRunningMessage = (
    <span className={baseHintClasses}>Stop Task to Unstake</span>
  );
  const unstakeWhenCoolingDownMessage = (
    <button onClick={unstake} className={baseHintClasses}>
      Wait 3 rounds
      <Icon
        source={TooltipChatQuestionLeftLine}
        className="text-white w-4 h-3.5 ml-2"
      />
    </button>
  );
  const archiveWhenRunningMessage = (
    <span className={baseHintClasses}>Stop Task to Archive</span>
  );
  const archiveWithStakeMessage = (
    <button onClick={unstake} className={baseHintClasses}>
      Unstake to Archive
    </button>
  );

  return (
    <div className={containerClasses}>
      <button
        onClick={runOrStopTask}
        className={`${baseItemClasses} ${
          isRunPauseButtonDisabled ? disabledItemClasses : ''
        }`}
        disabled={isRunPauseButtonDisabled}
      >
        <Icon source={task.isRunning ? PauseCircle : PlayCircle} />
        {task.isRunning ? 'Stop Task' : 'Start Task'}
      </button>
      <button
        onClick={addStake}
        className={`${baseItemClasses} ${
          !task.isWhitelisted ? disabledItemClasses : ''
        }`}
        disabled={!task.isWhitelisted}
      >
        <Icon source={CurrencyIcon} />
        Add Stake
      </button>
      <button
        onClick={unstake}
        disabled={!canUnstake}
        className={`${baseItemClasses} ${
          !canUnstake ? disabledItemClasses : ''
        }`}
      >
        <Icon source={RemoveLine} />
        Unstake
        {task.isRunning
          ? unstakeWhenRunningMessage
          : !canUnstake
          ? unstakeWhenCoolingDownMessage
          : null}
      </button>
      <button
        className={`${baseItemClasses} ${
          isArchiveDisabled ? disabledItemClasses : ''
        }`}
        disabled={isArchiveDisabled}
        onClick={() => archiveTask()}
      >
        <Icon source={Archive} />
        Archive
        {task.isRunning
          ? archiveWhenRunningMessage
          : taskStake
          ? archiveWithStakeMessage
          : null}
      </button>
      <button className={baseItemClasses} onClick={openLogs}>
        <Icon source={Output} />
        Output Logs
      </button>
    </div>
  );
}
