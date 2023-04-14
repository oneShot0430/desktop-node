import {
  PauseFill,
  PlayFill,
  HistoryClockLine,
  CurrencyMoneyLine,
  Icon,
} from '@_koii/koii-styleguide';
import React, { useMemo, useState } from 'react';
import { useQueryClient } from 'react-query';

import { RoundTime } from 'renderer/components/RoundTime';
import { SourceCodeButton } from 'renderer/components/SourceCodeButton';
import {
  Button,
  Tooltip,
  LoadingSpinner,
  LoadingSpinnerSize,
  TableRow,
  ColumnsLayout,
  NodeStatusCell,
} from 'renderer/components/ui';
import {
  useEditStakeAmountModal,
  useTaskStake,
  useMetadata,
} from 'renderer/features/common';
import { useEarnedReward } from 'renderer/features/common/hooks/useEarnedReward';
import { stopTask, startTask, TaskService, getLogs } from 'renderer/services';
import { Task } from 'renderer/types';
import { getCreatedAtDate, getKoiiFromRoe } from 'utils';

type PropsType = {
  task: Task;
  accountPublicKey: string;
  index: number;
  columnsLayout: ColumnsLayout;
};

export function TaskItem({
  task,
  accountPublicKey,
  index,
  columnsLayout,
}: PropsType) {
  const [loading, setLoading] = useState<boolean>(false);
  const { taskName, taskManager, isRunning, publicKey, roundTime } = task;
  const { showModal: showEditStakeAmountModal } = useEditStakeAmountModal({
    task,
  });
  const queryCache = useQueryClient();
  const { earnedReward } = useEarnedReward({ task, publicKey });
  const { taskStake } = useTaskStake({ task, publicKey: accountPublicKey });

  const earnedRewardInKoii = getKoiiFromRoe(earnedReward);
  const myStakeInKoii = getKoiiFromRoe(taskStake);
  const isFirstRowInTable = index === 0;
  const nodeStatus = useMemo(() => TaskService.getStatus(task), [task]);

  const { metadata } = useMetadata(task.metadataCID);

  const handleToggleTask = async () => {
    try {
      setLoading(true);
      if (isRunning) {
        await stopTask(publicKey);
      } else {
        await startTask(publicKey);
      }
    } catch (error) {
      console.warn(error);
    } finally {
      queryCache.invalidateQueries();
      setLoading(false);
    }
  };

  const handleOutputLogsToConsole = () => getLogs(task.publicKey);

  const createdAt = useMemo(
    () => getCreatedAtDate(metadata?.createdAt),
    [metadata]
  );

  return (
    <TableRow columnsLayout={columnsLayout} className="py-3.5">
      <div>
        {loading ? (
          <div>
            <LoadingSpinner size={LoadingSpinnerSize.Large} />
          </div>
        ) : (
          <Tooltip
            tooltipContent={`${isRunning ? 'Stop' : 'Start'} task`}
            placement={`${isFirstRowInTable ? 'bottom' : 'top'}-right`}
          >
            <Button
              onlyIcon
              icon={
                <Icon
                  source={isRunning ? PauseFill : PlayFill}
                  className="text-black h-[15px] w-[15px]"
                />
              }
              onClick={handleToggleTask}
              className={`${
                isRunning ? 'bg-finnieRed' : 'bg-finnieTeal'
              } rounded-full w-8 h-8`}
            />
          </Tooltip>
        )}
      </div>

      <SourceCodeButton
        repositoryUrl={metadata?.repositoryUrl || ''}
        iconSize={24}
      />

      <div className="text-xs flex flex-col gap-1">
        <div>{taskName}</div>
        <div className="text-finnieTeal">{createdAt}</div>
      </div>
      <div className="overflow-hidden text-ellipsis pr-8" title={taskManager}>
        {taskManager}
      </div>
      <div>{earnedRewardInKoii}</div>
      <div>{myStakeInKoii}</div>
      <RoundTime
        tooltipPlacement={`${isFirstRowInTable ? 'bottom' : 'top'}-right`}
        roundTime={roundTime}
      />
      <div>
        <NodeStatusCell
          status={nodeStatus}
          isFirstRowInTable={isFirstRowInTable}
        />
      </div>
      <div className="flex flex-row items-center gap-4">
        <Tooltip
          placement={`${isFirstRowInTable ? 'bottom' : 'top'}-left`}
          tooltipContent="Edit stake amount"
        >
          <Button
            onClick={showEditStakeAmountModal}
            onlyIcon
            icon={
              <Icon source={CurrencyMoneyLine} className="text-black h-8 w-8" />
            }
            className="bg-finnieTeal-100 py-0.75 pl-1 !pr-[0.5px] rounded-full"
          />
        </Tooltip>
        <Tooltip
          placement={`${isFirstRowInTable ? 'bottom' : 'top'}-left`}
          tooltipContent="Output logs to console"
        >
          <Button
            onClick={handleOutputLogsToConsole}
            onlyIcon
            icon={
              <Icon
                source={HistoryClockLine}
                className="text-finnieTeal-100 h-9 w-9"
              />
            }
          />
        </Tooltip>
      </div>
    </TableRow>
  );
}
