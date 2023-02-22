import {
  PauseFill,
  PlayFill,
  EmbedCodeFill,
  Icon,
} from '@_koii/koii-styleguide';
import React, { memo, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { twMerge } from 'tailwind-merge';

import {
  Button,
  LoadingSpinner,
  LoadingSpinnerSize,
  Tooltip,
  TableRow,
  ColumnsLayout,
} from 'renderer/components/ui';
import { useTaskStake, useTaskDetailsModal } from 'renderer/features/common';
import { EditStakeInput } from 'renderer/features/onboarding/components/EditStakeInput';
import {
  QueryKeys,
  startTask,
  TaskService,
  stopTask,
  getMainAccountPublicKey,
  stakeOnTask,
} from 'renderer/services';
import { Task } from 'renderer/types';
import { getKoiiFromRoe } from 'utils';

interface Props {
  task: Task;
  index: number;
  columnsLayout: ColumnsLayout;
}

function TaskItem({ task, index, columnsLayout }: Props) {
  /**
   * @todo: abstract it away to the hook
   */
  const { data: mainAccountPubKey, isLoading: loadingMainAccount } = useQuery(
    QueryKeys.MainAccount,
    () => getMainAccountPublicKey()
  );

  const { showModal } = useTaskDetailsModal({
    task,
    accountPublicKey: mainAccountPubKey as string,
  });

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
    setMeetsMinimumStake(taskStake >= (minStake as number));
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
    setMeetsMinimumStake(value >= (minStake as number));
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
        <div className="flex flex-col items-center justify-start w-[40px] gap-2">
          <Button
            icon={
              <Icon
                source={EmbedCodeFill}
                className="h-[34px] w-[34px] text-finnieTeal-100"
              />
            }
            onlyIcon
            onClick={handleShowCode}
          />
          <div className="text-[7px] -mt-2">INSPECT</div>
        </div>
      </Tooltip>
      <div className="text-xs flex flex-col gap-1">
        <div>{taskName}</div>
        <div className="text-finnieTeal">datestring</div>
      </div>
      <div className="overflow-hidden text-ellipsis pr-8" title={taskManager}>
        {taskManager}
      </div>
      <div>{bountyPerRoundInKoii}</div>
      <div>{nodes}</div>
      <div>{getKoiiFromRoe(topStake)}</div>
      <div>
        <EditStakeInput
          meetsMinimumStake={meetsMinimumStake}
          stake={stake}
          minStake={minStake as number}
          onChange={handleStakeValueChange}
          disabled={taskStake !== 0 || loadingTaskStake}
        />
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
                <Icon
                  source={isRunning ? PauseFill : PlayFill}
                  color="black"
                  className={twMerge(!meetsMinimumStake && 'filter grayscale')}
                  size={15}
                />
              }
              className={`${
                isRunning
                  ? 'bg-finnieRed'
                  : !meetsMinimumStake
                  ? 'bg-gray-300'
                  : 'bg-finnieTeal'
              } rounded-full w-8 h-8 mb-2`}
              onClick={isRunning ? handleStopTask : handleStartTask}
              disabled={!meetsMinimumStake}
            />
          </Tooltip>
        )}
      </div>
    </TableRow>
  );
}

export default memo(TaskItem);
