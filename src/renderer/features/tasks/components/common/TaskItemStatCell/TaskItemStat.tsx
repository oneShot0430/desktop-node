import React from 'react';

import { Placement as TooltipPlacementType } from 'renderer/components';
import { Popover } from 'renderer/components/ui/Popover/Popover';
import { Theme } from 'renderer/types/common';

type PropsType = {
  label: React.ReactNode;
  value: React.ReactNode;
  tooltipContent?: string;
  tooltipPlacement?: TooltipPlacementType;
};

export function TaskItemStatCell({
  label,
  value,
  tooltipContent,
  tooltipPlacement,
}: PropsType) {
  const content = (
    <div className="flex flex-col items-start text-white">
      <div className="text-[10px] xl:text-sm">{label}</div>
      <div className="text-xs xl:text-base">{value ?? 'N/A'}</div>
    </div>
  );
  return tooltipContent ? (
    <Popover tooltipContent={tooltipContent} theme={Theme.Dark}>
      {content}
    </Popover>
  ) : (
    content
  );
}
