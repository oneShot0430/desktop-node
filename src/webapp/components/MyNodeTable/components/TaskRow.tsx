import React, { useMemo, useState } from 'react';
import { useQueryClient } from 'react-query';

import ActionHistoryIcon from 'assets/svgs/action-history-icon.svg';
import AddWithdrawIcon from 'assets/svgs/add-withdraw-icon.svg';
import PauseIcon from 'assets/svgs/pause-icon.svg';
import PlayIcon from 'assets/svgs/play-icon.svg';
import { getKoiiFromRoe } from 'utils';
import {
  Button,
  Tooltip,
  LoadingSpinner,
  LoadingSpinnerSize,
} from 'webapp/components';
import {
  TableRow,
  TableCell,
  NodeStatusCell,
  TaskDetailsCell,
} from 'webapp/components/ui/Table';
import { useEditStakeAmountModal, useTaskStake } from 'webapp/features/common';
import { useEarnedReward } from 'webapp/features/common/hooks/useEarnedReward';
import { stopTask, startTask, TaskService, getLogs } from 'webapp/services';
import { Task } from 'webapp/types';

import { useTaskDetailsModal } from '../hooks';

type PropsType = {
  task: Task;
  accountPublicKey: string;
};

export const TaskRow = ({ task, accountPublicKey }: PropsType) => {
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

  const nodeStatus = useMemo(() => TaskService.getStatus(task), [task]);

  return (
    <TableRow key={publicKey}>
      <TableCell>
        {loading ? (
          <div className="pl-2">
            <LoadingSpinner size={LoadingSpinnerSize.Large} />
          </div>
        ) : (
          <Tooltip tooltipContent={`${isRunning ? 'Stop' : 'Start'} task`}>
            <Button
              onlyIcon
              icon={isRunning ? <PauseIcon /> : <PlayIcon />}
              onClick={handleToggleTask}
            />
          </Tooltip>
        )}
      </TableCell>
      <TaskDetailsCell
        taskName={taskName}
        createdAt={'date string'}
        onClick={showTaskDetailsModal}
      />
      <TableCell>
        <span title={taskManager}>{`${taskManager.substring(0, 6)}...`}</span>
      </TableCell>
      <TableCell>{earnedRewardInKoii}</TableCell>
      <TableCell>{myStakeInKoii}</TableCell>
      <NodeStatusCell status={nodeStatus} />
      <TableCell>
        <div className="flex flex-row items-center gap-4">
          <Tooltip placement="top-left" tooltipContent="Edit stake amount">
            <Button
              onClick={showEditStakeAmountModal}
              onlyIcon
              icon={<AddWithdrawIcon />}
            />
          </Tooltip>

          <Tooltip placement="top-left" tooltipContent="Output logs to console">
            <Button
              onClick={handleOutputLogsToConsole}
              onlyIcon
              icon={<ActionHistoryIcon />}
            />
          </Tooltip>
        </div>
      </TableCell>
    </TableRow>
  );
};
