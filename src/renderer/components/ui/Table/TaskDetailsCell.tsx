import React from 'react';

import CodeIcon from 'assets/svgs/code-icon.svg';
import { Tooltip } from 'renderer/components/ui/Tooltip';

type PropsType = {
  taskName: string;
  onClick: () => void;
  createdAt: string;
  isFirstRow?: boolean;
};

export function TaskDetailsCell({
  taskName,
  onClick,
  createdAt,
  isFirstRow,
}: PropsType) {
  return (
    <div
      className="flex items-center justify-start gap-1 cursor-pointer"
      onClick={onClick}
    >
      <Tooltip
        placement={`${isFirstRow ? 'bottom' : 'top'}-right`}
        tooltipContent="Inspect task details"
      >
        <CodeIcon />
      </Tooltip>
      <div className="text-xs">
        <div>{taskName ?? ''}</div>
        <div className="text-finnieTeal">{createdAt}</div>
      </div>
    </div>
  );
}
