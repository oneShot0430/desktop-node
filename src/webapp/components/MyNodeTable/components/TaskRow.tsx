import React from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';

import AddWithdrawIcon from 'assets/svgs/add-withdraw-icon.svg';
import PauseIcon from 'assets/svgs/pause-icon.svg';
import PlayIcon from 'assets/svgs/play-icon.svg';
import { Task } from 'webapp/@type/task';
import { Button } from 'webapp/components/ui/Button';
import {
  TableRow,
  TableCell,
  NodeStatusCell,
  TaskDetailsCell,
} from 'webapp/components/ui/Table';
import { getRewardEarned } from 'webapp/services/api';
import { TaskService } from 'webapp/services/taskService';
import { showModal } from 'webapp/store/actions/modal';

export const TaskRow = ({ task }: { task: Task }) => {
  const dispatch = useDispatch();
  const { taskName, taskManager, isRunning, publicKey, availableBalances } =
    task;

  const earnedReward = 0;
  // const { data: earnedReward } = useQuery(`rewardEarned${publicKey}`, () =>
  //   getRewardEarned(publicKey, availableBalances)
  // );

  const nodeStatus = TaskService.getStatus(task);

  return (
    <TableRow key={publicKey}>
      <TableCell>
        <Button onlyIcon icon={isRunning ? <PauseIcon /> : <PlayIcon />} />
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
      <TableCell>{'TBD'}</TableCell>
      <NodeStatusCell status={nodeStatus} />
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
