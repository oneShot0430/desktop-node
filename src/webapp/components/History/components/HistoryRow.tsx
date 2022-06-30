import React from 'react';
import { useDispatch } from 'react-redux';

import { Task } from 'webapp/@type/task';
import {
  TableRow,
  TableCell,
  NodeStatusCell,
} from 'webapp/components/ui/Table';
import { TaskDetailsCell } from 'webapp/components/ui/Table/TaskDetailsCell';
import { TaskService } from 'webapp/services/taskService';
import { showModal } from 'webapp/store/actions/modal';

export const HistoryRow = ({ task }: { task: Task }) => {
  const dispatch = useDispatch();
  const { taskName, publicKey } = task;

  const stake = TaskService.getMyStake(task);
  const nodes = TaskService.getNodesCount(task);
  const topStake = TaskService.getTopStake(task);

  const nodeStatus = TaskService.getStatus(task);

  return (
    <TableRow key={publicKey}>
      <TaskDetailsCell
        taskName={taskName}
        createdAt={'DATE STRING'}
        onClick={() => dispatch(showModal('TASK_DETAILS', task))}
      />
      <TableCell>{'TBD'}</TableCell>
      <NodeStatusCell status={nodeStatus} />
      <TableCell>{nodes}</TableCell>
      <TableCell>{topStake}</TableCell>
      <TableCell>{stake}</TableCell>
    </TableRow>
  );
};
