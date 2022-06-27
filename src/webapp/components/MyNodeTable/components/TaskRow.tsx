import React from 'react';
import { useDispatch } from 'react-redux';

import AddWithdrawIcon from 'assets/svgs/add-withdraw-icon.svg';
import CodeIcon from 'assets/svgs/code-icon.svg';
import PauseIcon from 'assets/svgs/pause-icon.svg';
import PlayIcon from 'assets/svgs/play-icon.svg';
import { Task } from 'webapp/@type/task';
import { Button } from 'webapp/components/ui/Button';
import { TableRow } from 'webapp/components/ui/Table';
import { showModal } from 'webapp/store/actions/modal';

const TableCell = ({ children }: { children: React.ReactNode }) => (
  <td className="pt-2 align-middle ">{children}</td>
);

export const TaskRow = ({ task }: { task: Task }) => {
  const { isRunning, taskName } = task;
  const dispatch = useDispatch();

  return (
    <TableRow>
      <TableCell>
        <Button onlyIcon icon={isRunning ? <PauseIcon /> : <PlayIcon />} />
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
      <TableCell>{task.taskManager}</TableCell>
      <TableCell>{task.totalBountyAmount}</TableCell>
      <TableCell>{'TBD'}</TableCell>
      <TableCell>{'TBD'}</TableCell>
      <TableCell>
        <Button
          onClick={() => dispatch(showModal('EDIT_STAKE_AMOUNT'))}
          onlyIcon
          icon={<AddWithdrawIcon />}
        />
      </TableCell>
    </TableRow>
  );
};
