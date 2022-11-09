import { CloseXFill, Icon } from '@_koii/koii-styleguide';
import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { Theme } from 'webapp/types/common';

type PropsType = {
  children: React.ReactNode;
  tooltipContent: React.ReactNode;
  manualClose?: boolean;
  theme?: Theme;
};

export const Tooltip = ({
  children,
  tooltipContent,
  manualClose = false,
  theme = Theme.Light,
}: PropsType) => {
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

  const wrappingClasses = twMerge(
    'absolute translate-y-full transition-opacity opacity-0 duration-300 invisible',
    isHovered ? 'opacity-100' : 'opacity-0',
    isHovered ? 'visible' : 'invisible'
  );

  const tooltipClasses = twMerge(
    'max-w-[240px] text-white z-10 inline-block p-2 text-xs font-medium rounded-md shadow-sm bg-finnieBlue tooltip leading-5',
    theme === Theme.Dark ? 'bg-finnieBlue' : 'bg-white text-finnieBlue'
  );

  return (
    <div
      className="relative inline-block cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={wrappingClasses}>
        <div className="flex">
          <div className={tooltipClasses} role="tooltip">
            {tooltipContent}
          </div>
          {manualClose && (
            <span onClick={handleClose}>
              <Icon source={CloseXFill} size={48} color="#5ED9D1" />
            </span>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};
