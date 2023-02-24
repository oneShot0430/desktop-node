import { CloseFill, Icon } from '@_koii/koii-styleguide';
import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { Theme } from 'webapp/types/common';

type VerticalPlacement = 'top' | 'bottom';
type HorizontalPlacement = 'left' | 'right';
type CombinedPlacement = `${VerticalPlacement}-${HorizontalPlacement}`;
export type Placement = HorizontalPlacement | CombinedPlacement;

type PropsType = {
  children: React.ReactNode;
  tooltipContent: React.ReactNode;
  manualClose?: boolean;
  theme?: Theme;
  placement?: Placement;
  forceDisplaying?: boolean;
};

export function Tooltip({
  children,
  tooltipContent,
  theme = Theme.Dark,
  placement = 'top-right',
  manualClose = false,
  forceDisplaying = false,
}: PropsType) {
  const [isHovered, setIsHovered] = useState(manualClose);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!manualClose) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!manualClose) {
      setIsHovered(false);
    }
  };

  const handleClose = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsHovered(false);
  };

  const classesByPlacement = {
    right: 'left-full after:-left-[15px] after:top-[6px] after:rotate-90',
    left: 'right-full after:-right-[15px] after:top-[6px] after:-rotate-90',
    'top-right':
      'left-0 after:left-[10px] -translate-y-[120%] after:-bottom-[12px]',
    'top-left':
      'right-0 after:right-[10px] -translate-y-[120%] after:-bottom-[12px]',
    'bottom-right':
      'left-0 after:left-[10px] translate-y-[120%] after:-top-[12px] after:-rotate-180',
    'bottom-left':
      'right-0 after:right-[10px] translate-y-[120%] after:-top-[12px] after:-rotate-180',
  }[placement];

  const arrowClasses = `after:absolute after:border-t-[15px] after:border-x-[10px] after:border-solid after:border-transparent after:z-50 flex ${
    theme === Theme.Dark ? 'after:border-t-purple-3' : 'after:border-t-white'
  }`;

  const wrappingClasses = twMerge(
    'z-50 absolute max-w-xl transition-opacity opacity-0 duration-300 invisible',
    isHovered || forceDisplaying
      ? 'opacity-100 visible'
      : 'opacity-0 invisible',
    arrowClasses,
    classesByPlacement
  );

  const tooltipClasses = twMerge(
    'z-50 max-w-xl w-max text-white inline-block p-2 text-xs font-medium rounded-md shadow-sm bg-purple-3 tooltip leading-5',
    theme === Theme.Dark ? 'bg-purple-3' : 'bg-white text-finnieBlue'
  );

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={wrappingClasses}>
        <div className={tooltipClasses} role="tooltip">
          {tooltipContent}
        </div>
        {manualClose && (
          <span onClick={handleClose}>
            <Icon source={CloseFill} className="z-50 h-8 w-8 text-finnieTeal" />
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
