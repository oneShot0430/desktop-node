import React from 'react';

import AddWithdrawIcon from 'assets/svgs/add-withdraw-icon.svg';
import CodeIcon from 'assets/svgs/code-icon.svg';
import PauseIcon from 'assets/svgs/pause-icon.svg';
import PlayIcon from 'assets/svgs/play-icon.svg';
import { Task } from 'webapp/@type/task';
import { Button } from 'webapp/components/ui/Button';
import { TableRow } from 'webapp/components/ui/Table';

export const TaskRow = ({ task }: { task: Task }) => {
  const { isRunning, taskName } = task;

  return (
    <TableRow>
      <td className="align-middle">
        <Button onlyIcon icon={isRunning ? <PauseIcon /> : <PlayIcon />} />
      </td>
      <td className="align-middle">
        <div className="flex items-center justify-start gap-1">
          <CodeIcon />
          <div className="text-xs">
            <div>{taskName ?? ''}</div>
            <div className="text-finnieTeal">{'date tbd'}</div>
          </div>
        </div>
      </td>
      <td className="align-middle">{task.taskManager}</td>
      <td className="align-middle">{task.totalBountyAmount}</td>
      <td className="align-middle">{'TBD'}</td>
      <td className="align-middle">{'TBD'}</td>
      <td className="flex flex-col items-center justify-center">
        <AddWithdrawIcon />
      </td>
    </TableRow>
  );
};
