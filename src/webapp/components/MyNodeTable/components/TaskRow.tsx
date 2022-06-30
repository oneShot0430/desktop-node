import React from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';

import AddWithdrawIcon from 'assets/svgs/add-withdraw-icon.svg';
import CodeIcon from 'assets/svgs/code-icon.svg';
import PauseIcon from 'assets/svgs/pause-icon.svg';
import PlayIcon from 'assets/svgs/play-icon.svg';
import { Task } from 'webapp/@type/task';
import { Button } from 'webapp/components/ui/Button';
import { TableRow, TableCell } from 'webapp/components/ui/Table';
import { getRewardEarned } from 'webapp/services/api';
import { TaskService } from 'webapp/services/taskService';
import { showModal } from 'webapp/store/actions/modal';

import { NodeStatus } from './NodeStatus';

export const TaskRow = ({ task }: { task: Task }) => {
  const dispatch = useDispatch();
  const { taskName, taskManager, isRunning, publicKey, availableBalances } =
    task;
  const { data: earnedReward } = useQuery(`rewardEarned${publicKey}`, () =>
    getRewardEarned(publicKey, availableBalances)
  );

  const nodeStatus = TaskService.getStatus(task);

  return (
    <TableRow key={publicKey}>
      <TableCell>
        <Button onlyIcon icon={isRunning ? <PauseIcon /> : <PlayIcon />} />
      </TableCell>
      <TableCell>
        <div
          className="flex items-center justify-start gap-1 cursor-pointer"
          onClick={() => dispatch(showModal('TASK_DETAILS', task))}
        >
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
      <TableCell>{'TBD'}</TableCell>
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
