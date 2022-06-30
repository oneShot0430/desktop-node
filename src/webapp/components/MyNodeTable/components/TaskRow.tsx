import React from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';

import AddWithdrawIcon from 'assets/svgs/add-withdraw-icon.svg';
import CodeIcon from 'assets/svgs/code-icon.svg';
import PauseIcon from 'assets/svgs/pause-icon.svg';
import PlayIcon from 'assets/svgs/play-icon.svg';
import { Task } from 'webapp/@type/task';
import { Button } from 'webapp/components/ui/Button';
import { TableRow, TableCell } from 'webapp/components/ui/Table';
import {
  QueryKeys,
  getRewardEarned,
  stopTask,
  startTask,
  TaskService,
} from 'webapp/services';
import { showModal } from 'webapp/store/actions/modal';

import { NodeStatus } from './NodeStatus';

export const TaskRow = ({ task }: { task: Task }) => {
  const dispatch = useDispatch();
  const { taskName, taskManager, isRunning, publicKey, availableBalances } =
    task;

  const { data: earnedReward } = useQuery(
    [QueryKeys.taskReward, publicKey],
    () => getRewardEarned(publicKey, availableBalances)
  );

  const nodeStatus = TaskService.getStatus(task);
  const myState = TaskService.getMyStake(task);

  const handleToggleTask = () => {
    (isRunning ? stopTask(publicKey) : startTask(publicKey)).finally(() => {
      console.log('invalidate query');
      useQueryClient().invalidateQueries(QueryKeys.taskList);
    });
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
      <TableCell>
        <div className="flex items-center justify-start gap-1">
          <CodeIcon />
          <div className="text-xs">
            <div>{taskName ?? ''}</div>
            <div className="text-finnieTeal">{'date tbd'}</div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <span title={taskManager}>{`${taskManager.substring(0, 6)}...`}</span>
      </TableCell>
      <TableCell>{earnedReward}</TableCell>
      <TableCell>{myState}</TableCell>
      <TableCell>
        <NodeStatus status={nodeStatus} />
      </TableCell>
      <TableCell>
        <Button
          onClick={() => dispatch(showModal('EDIT_STAKE_AMOUNT', task))}
          onlyIcon
          icon={<AddWithdrawIcon />}
        />
      </TableCell>
    </TableRow>
  );
};
