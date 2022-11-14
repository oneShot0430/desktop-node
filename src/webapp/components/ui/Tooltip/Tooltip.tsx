import { CloseXFill, Icon } from '@_koii/koii-styleguide';
import React, { useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { Theme } from 'webapp/types/common';

type PropsType = {
  children: React.ReactNode;
  tooltipContent: React.ReactNode;
  manualClose?: boolean;
  theme?: Theme;
  //placement?: 'top' | 'bottom' | 'left' | 'right';
};

export const Tooltip = ({
  children,
  tooltipContent,
  manualClose = false,
  theme = Theme.Light,
}: PropsType) => {
  const [isHovered, setIsHovered] = useState(manualClose);
  const parentRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

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

  const wrappingClasses = twMerge(
    'absolute transition-opacity opacity-0 duration-300 invisible',
    isHovered ? 'opacity-100 visible' : 'opacity-0 invisible',
    'after:absolute after:top-[99%] after:left-[10%] after:ml-[5px] after:border-y-[15px] after:border-x-[10px] after:border-solid after:border-transparent',
    theme === Theme.Dark ? 'after:border-t-purple-3' : 'after:border-t-white'
  );

  const tooltipClasses = twMerge(
    'max-w-[240px] w-max text-white z-10 inline-block p-2 text-xs font-medium rounded-md shadow-sm bg-purple-3 tooltip leading-5 w-fit',
    theme === Theme.Dark ? 'bg-purple-3' : 'bg-white text-finnieBlue'
  );

  return (
    <div
      ref={parentRef}
      className="relative z-20 inline-block cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`${wrappingClasses} translate-y-[-120%] -translate-x-1/5`}
      >
        <div className="z-50 flex" ref={tooltipRef}>
          <div className={tooltipClasses} role="tooltip">
            <div className="w-full">{tooltipContent}</div>
          </div>
          {manualClose && (
            <span onClick={handleClose}>
              <Icon
                source={CloseXFill}
                size={32}
                color="#5ED9D1"
                className="z-50"
              />
            </span>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};
