import * as Tooltip from '@radix-ui/react-tooltip';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import { Theme } from 'renderer/types/common';

interface TooltipComponentProps {
  tooltipContent: React.ReactNode;
  children: React.ReactNode;
  theme?: Theme;
}

export function Popover({
  tooltipContent,
  children,
  theme,
}: TooltipComponentProps) {
  const arrowFill = theme === Theme.Dark ? '#353570' : '#fff';
  const tooltipClasses = twMerge(
    theme === Theme.Dark ? 'text-white' : 'text-finnieBlue',
    theme === Theme.Dark ? 'bg-purple-3' : 'bg-white',
    'rounded-md',
    'p-2',
    'leading-5',
    'text-xs',
    'z-50'
  );

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger>{children}</Tooltip.Trigger>
        <Tooltip.Content
          side="top"
          align="start"
          avoidCollisions
          className={tooltipClasses}
        >
          {tooltipContent}
          <Tooltip.Arrow style={{ fill: arrowFill }} />
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
