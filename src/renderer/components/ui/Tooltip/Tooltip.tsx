// import { CloseFill, Icon } from '@_koii/koii-styleguide';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import { Theme } from 'renderer/types/common';

type VerticalPlacement = 'top' | 'bottom';
type HorizontalPlacement = 'left' | 'right';
type CombinedPlacement = `${VerticalPlacement}-${HorizontalPlacement}`;
export type Placement = HorizontalPlacement | CombinedPlacement;

type PropsType = {
  children: React.ReactNode;
  tooltipContent: React.ReactNode;
  theme?: Theme;
  placement?: Placement;
};

export function Tooltip({
  children,
  tooltipContent,
  theme = Theme.Dark,
  placement = 'top-right',
}: PropsType) {
  const classesByPlacement = {
    right: 'left-full after:-left-[15px] after:top-[6px] after:rotate-90',
    left: 'right-full after:-right-[15px] after:top-[6px] after:-rotate-90',
    'top-right':
      'left-0 after:left-[10px] -translate-y-[100%] after:-bottom-[12px]',
    'top-left':
      'right-0 after:right-[10px] -translate-y-[100%] after:-bottom-[12px]',
    'bottom-right':
      'left-0 after:left-[10px] translate-y-[45px] after:-top-[12px] after:-rotate-180',
    'bottom-left':
      'right-0 after:right-[10px] translate-y-[45px] after:-top-[12px] after:-rotate-180',
  }[placement];

  const arrowClasses = `after:absolute after:border-t-[15px] after:border-x-[10px] after:border-solid after:border-transparent after:z-50 flex ${
    theme === Theme.Dark ? 'after:border-t-purple-3' : 'after:border-t-white'
  }`;

  const wrappingClasses = twMerge(
    'z-50 absolute max-w-xl transition-opacity opacity-0 duration-300 invisible',
    // manualClose &&
    'opacity-0 invisible group-hover:opacity-100 group-hover:visible',
    arrowClasses,
    classesByPlacement
  );

  const tooltipClasses = twMerge(
    'z-50 max-w-xl w-max text-white inline-block p-2 text-xs font-medium rounded-md shadow-sm bg-purple-3 tooltip leading-5',
    theme === Theme.Dark ? 'bg-purple-3' : 'bg-white text-finnieBlue'
  );

  return (
    <div className="relative inline-block group">
      <div className={wrappingClasses}>
        <div className={tooltipClasses} role="tooltip">
          {tooltipContent}
        </div>
        {/* {manualClose && (
          <span onClick={handleClose}>
            <Icon source={CloseFill} className="z-50 h-8 w-8 text-finnieTeal" />
          </span>
        )} */}
      </div>
      {children}
    </div>
  );
}
