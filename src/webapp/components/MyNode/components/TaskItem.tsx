import {
  PauseFill,
  PlayFill,
  HistoryClockLine,
  EmbedCodeFill,
  CurrencyMoneyLine,
  Icon,
} from '@_koii/koii-styleguide';
import React, { useMemo, useState } from 'react';
import { useQueryClient } from 'react-query';

import { getKoiiFromRoe } from 'utils';
import {
  Button,
  Tooltip,
  LoadingSpinner,
  LoadingSpinnerSize,
  TableRow,
  ColumnsLayout,
  NodeStatusCell,
} from 'webapp/components/ui';
import {
  useEditStakeAmountModal,
  useTaskStake,
  useTaskDetailsModal,
} from 'webapp/features/common';
import { useEarnedReward } from 'webapp/features/common/hooks/useEarnedReward';
import { stopTask, startTask, TaskService, getLogs } from 'webapp/services';
import { Task } from 'webapp/types';

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
  const { taskName, taskManager, isRunning, publicKey } = task;
  const { showModal: showEditStakeAmountModal } = useEditStakeAmountModal({
    task,
  });
  const { showModal: showTaskDetailsModal } = useTaskDetailsModal({
    task,
    accountPublicKey,
  });
  const queryCache = useQueryClient();
  const { earnedReward } = useEarnedReward({ task, publicKey });
  const { taskStake } = useTaskStake({ task, publicKey: accountPublicKey });

  const earnedRewardInKoii = getKoiiFromRoe(earnedReward);
  const myStakeInKoii = getKoiiFromRoe(taskStake);
  const isFirstRowInTable = index === 0;
  const nodeStatus = useMemo(() => TaskService.getStatus(task), [task]);

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

  return (
    <TableRow columnsLayout={columnsLayout}>
      <div>
        {loading ? (
          <div className="pl-2">
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
              } rounded-full w-8 h-8 mb-2`}
            />
          </Tooltip>
        )}
      </div>
      <Tooltip
        placement={`${isFirstRowInTable ? 'bottom' : 'top'}-right`}
        tooltipContent="Inspect task details"
      >
        <Icon
          source={EmbedCodeFill}
          onClick={showTaskDetailsModal}
          className="cursor-pointer h-6 w-6 ml-2.5 -mr-1.5 text-finnieTeal-100"
        />
      </Tooltip>
      <div className="text-xs flex flex-col gap-1">
        <div>{taskName}</div>
        <div className="text-finnieTeal">date string</div>
      </div>
      <div className="overflow-hidden text-ellipsis pr-8" title={taskManager}>
        {taskManager}
      </div>
      <div>{earnedRewardInKoii}</div>
      <div>{myStakeInKoii}</div>
      <div>
        <NodeStatusCell
          status={nodeStatus}
          isFirstRowInTable={isFirstRowInTable}
        />
      </div>
      <div className="flex flex-row items-center gap-4 ">
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
            className="bg-finnieTeal-100 py-0.75 pl-1 !pr-[0.5px] rounded-full mb-2"
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
                className="text-finnieTeal-100 h-9 w-9 mb-2"
              />
            }
          />
        </Tooltip>
      </div>
    </TableRow>
  );
}
