import React, { memo, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { twMerge } from 'tailwind-merge';

import CodeIcon from 'assets/svgs/code-icon-lg.svg';
import PlayIcon from 'assets/svgs/play-icon.svg';
import StopTealIcon from 'assets/svgs/stop-icon-teal.svg';
import { getKoiiFromRoe } from 'utils';
import {
  Button,
  LoadingSpinner,
  LoadingSpinnerSize,
  Tooltip,
  TableRow,
  ColumnsLayout,
} from 'webapp/components';
import { useTaskStake, useTaskDetailsModal } from 'webapp/features/common';
import {
  QueryKeys,
  startTask,
  TaskService,
  stopTask,
  getMainAccountPublicKey,
  stakeOnTask,
} from 'webapp/services';
import { Task } from 'webapp/types';

import { TaskSettings } from './TaskSettings';

interface Props {
  task: Task;
  index: number;
  columnsLayout: ColumnsLayout;
}

const TaskItem = ({ task, index, columnsLayout }: Props) => {
  const [showSettings, setShowSettings] = useState<boolean>(false);
  /**
   * @todo: abstract it away to the hook
   */
  const { data: mainAccountPubKey, isLoading: loadingMainAccount } = useQuery(
    QueryKeys.MainAccount,
    () => getMainAccountPublicKey()
  );

  const { showModal } = useTaskDetailsModal({
    task,
    accountPublicKey: mainAccountPubKey,
  });

  const handleToggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const [stake, setStake] = useState<number>(0);
  const [meetsMinimumStake, setMeetsMinimumStake] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const queryCache = useQueryClient();
  const { taskName, publicKey, bountyAmountPerRound, taskManager, isRunning } =
    task;
  const nodes = TaskService.getNodesCount(task);
  const topStake = TaskService.getTopStake(task);
  const bountyPerRoundInKoii = getKoiiFromRoe(bountyAmountPerRound);
  const isFirstRowInTable = index === 0;

  const { taskStake, loadingTaskStake } = useTaskStake({
    task,
    publicKey: mainAccountPubKey,
  });

  const { data: minStake } = useQuery([QueryKeys.minStake, publicKey], () =>
    TaskService.getMinStake(task)
  );

  useEffect(() => {
    setStake(taskStake);
    setMeetsMinimumStake(taskStake >= minStake);
  }, [minStake, taskStake]);

  const handleStartTask = async () => {
    try {
      setLoading(true);
      if (taskStake === 0) {
        await stakeOnTask(publicKey, stake);
      }
      await startTask(publicKey);
    } catch (error) {
      console.error(error);
    } finally {
      queryCache.invalidateQueries();
      setLoading(false);
    }
  };

  const handleStopTask = async () => {
    try {
      await stopTask(publicKey);
    } catch (error) {
      console.error(error);
    } finally {
      queryCache.invalidateQueries();
    }
  };

  const handleStakeValueChange = (value: number) => {
    setStake(value);
    setMeetsMinimumStake(value >= minStake);
  };

  const handleShowCode = () => {
    showModal();
  };

  if (loadingMainAccount) return null;

  return (
    <TableRow columnsLayout={columnsLayout}>
      <Tooltip
        placement={`${isFirstRowInTable ? 'bottom' : 'top'}-right`}
        tooltipContent="Inspect task details"
      >
        <div className="flex flex-col items-center justify-start w-[40px]">
          <Button icon={<CodeIcon />} onlyIcon onClick={handleShowCode} />
          <div className="text-[6px] -mt-2">INSPECT</div>
        </div>
      </Tooltip>

      <div className="flex flex-col gap-1 text-xs">
        <div>{taskName}</div>
        <div className="text-finnieTeal">datestring</div>
      </div>

      <div className="pr-8 overflow-hidden text-ellipsis" title={taskManager}>
        {taskManager}
      </div>

      <div>{bountyPerRoundInKoii}</div>

      <div>{nodes}</div>

      <div>{getKoiiFromRoe(topStake)}</div>

      <div>
        {/* <EditStakeInput
          meetsMinimumStake={meetsMinimumStake}
          stake={stake}
          minStake={minStake}
          onChange={handleStakeValueChange}
          disabled={taskStake !== 0 || loadingTaskStake}
        /> */}
        <div>
          <button onClick={handleToggleSettings}>Settings</button>
        </div>
      </div>

      <div>
        {loading ? (
          <div className="pl-2">
            <LoadingSpinner size={LoadingSpinnerSize.Large} />
          </div>
        ) : (
          <Tooltip
            placement={`${isFirstRowInTable ? 'bottom' : 'top'}-left`}
            tooltipContent={`${isRunning ? 'Stop' : 'Start'} task`}
          >
            <Button
              onlyIcon
              icon={
                isRunning ? (
                  <StopTealIcon />
                ) : (
                  <PlayIcon
                    className={twMerge(
                      !meetsMinimumStake && 'filter grayscale'
                    )}
                  />
                )
              }
              onClick={isRunning ? handleStopTask : handleStartTask}
              disabled={!meetsMinimumStake}
            />
          </Tooltip>
        )}
      </div>

      <div
        className={`w-full col-span-8 ${
          showSettings ? 'flex' : 'hidden'
        } transition-all duration-500 ease-in-out`}
      >
        <TaskSettings />
      </div>
    </TableRow>
  );
};

export default memo(TaskItem);
