import React, { useMemo, useState } from 'react';
import { useQueryClient } from 'react-query';

import ActionHistoryIcon from 'assets/svgs/action-history-icon.svg';
import AddWithdrawIcon from 'assets/svgs/add-withdraw-icon.svg';
import CodeIcon from 'assets/svgs/code-icon.svg';
import PauseIcon from 'assets/svgs/pause-icon.svg';
import PlayIcon from 'assets/svgs/play-icon.svg';
import { getKoiiFromRoe } from 'utils';
import {
  Button,
  Tooltip,
  LoadingSpinner,
  LoadingSpinnerSize,
  TableRow,
  ColumnsLayout,
  NodeStatusCell,
} from 'webapp/components';
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

export const TaskItem = ({
  task,
  accountPublicKey,
  index,
  columnsLayout,
}: PropsType) => {
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
              icon={isRunning ? <PauseIcon /> : <PlayIcon />}
              onClick={handleToggleTask}
            />
          </Tooltip>
        )}
      </div>
      <Tooltip
        placement={`${isFirstRowInTable ? 'bottom' : 'top'}-right`}
        tooltipContent="Inspect task details"
      >
        <CodeIcon
          onClick={showTaskDetailsModal}
          className="cursor-pointer ml-2.5 -mr-1.5"
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
            icon={<AddWithdrawIcon />}
          />
        </Tooltip>
        <Tooltip
          placement={`${isFirstRowInTable ? 'bottom' : 'top'}-left`}
          tooltipContent="Output logs to console"
        >
          <Button
            onClick={handleOutputLogsToConsole}
            onlyIcon
            icon={<ActionHistoryIcon />}
          />
        </Tooltip>
      </div>
    </TableRow>
  );
};
