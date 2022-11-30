import React from 'react';

import CodeIcon from 'assets/svgs/code-icon.svg';
import { Tooltip } from 'webapp/components';

import { TableCell } from './TableCell';

type PropsType = {
  taskName: string;
  onClick: () => void;
  createdAt: string;
};

export const TaskDetailsCell = ({
  taskName,
  onClick,
  createdAt,
}: PropsType) => {
  return (
    <TableCell>
      <div
        className="flex items-center justify-start gap-1 cursor-pointer"
        onClick={onClick}
      >
        <Tooltip tooltipContent="Inspect task details">
          <CodeIcon />
        </Tooltip>
        <div className="text-xs">
          <div>{taskName ?? ''}</div>
          <div className="text-finnieTeal">{createdAt}</div>
        </div>
      </div>
    </TableCell>
  );
};
