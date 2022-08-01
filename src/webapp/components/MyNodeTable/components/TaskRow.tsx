import React from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';

import ActionHistoryIcon from 'assets/svgs/action-history-icon.svg';
import AddWithdrawIcon from 'assets/svgs/add-withdraw-icon.svg';
import PauseIcon from 'assets/svgs/pause-icon.svg';
import PlayIcon from 'assets/svgs/play-icon.svg';
import { Button } from 'webapp/components/ui/Button';
import {
  TableRow,
  TableCell,
  NodeStatusCell,
  TaskDetailsCell,
} from 'webapp/components/ui/Table';
import {
  QueryKeys,
  getRewardEarned,
  stopTask,
  startTask,
  TaskService,
  getLogs,
} from 'webapp/services';
import { showModal } from 'webapp/store/actions/modal';
import { Task } from 'webapp/types';

export const TaskRow = ({ task }: { task: Task }) => {
  const dispatch = useDispatch();
  const queryCache = useQueryClient();
  const { taskName, taskManager, isRunning, publicKey } = task;

  const { data: earnedReward } = useQuery(
    [QueryKeys.taskReward, publicKey],
    () => getRewardEarned(task)
  );

  const { data: myStake } = useQuery([QueryKeys.myStake, publicKey], () =>
    TaskService.getMyStake(task)
  );

  const nodeStatus = TaskService.getStatus(task);

  const handleToggleTask = async () => {
    try {
      if (isRunning) {
        await stopTask(publicKey);
      } else {
        await startTask(publicKey);
      }
    } catch (error) {
      console.warn(error);
    } finally {
      console.log('####refetch');
      queryCache.invalidateQueries();
    }
  };

  return (
    <TableRow key={publicKey}>
      <TableCell>
        <Button
          onlyIcon
          icon={isRunning ? <PauseIcon /> : <PlayIcon />}
          title={isRunning ? 'Stop' : 'Start'}
          onClick={handleToggleTask}
        />
      </TableCell>
      <TaskDetailsCell
        taskName={taskName}
        createdAt={'date string'}
        onClick={() => dispatch(showModal('TASK_DETAILS', task))}
      />
      <TableCell>
        <span title={taskManager}>{`${taskManager.substring(0, 6)}...`}</span>
      </TableCell>
      <TableCell>{earnedReward}</TableCell>
      <TableCell>{myStake}</TableCell>
      <NodeStatusCell status={nodeStatus} />
      <TableCell>
        <div className="flex flex-row items-center gap-4">
          <div>
            <Button
              onClick={() => dispatch(showModal('EDIT_STAKE_AMOUNT', task))}
              onlyIcon
              icon={<AddWithdrawIcon />}
            />
          </div>
          <div title="Output Node logs to console">
            <Button
              onClick={() => getLogs(task.publicKey)}
              onlyIcon
              icon={<ActionHistoryIcon />}
            />
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};
