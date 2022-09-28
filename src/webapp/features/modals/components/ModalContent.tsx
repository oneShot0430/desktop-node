import React, { memo } from 'react';
import { twMerge } from 'tailwind-merge';

import { Theme } from 'webapp/types/common';

type PropTypes = {
  children: React.ReactNode;
  onClose?: () => void;
  theme?: Theme;
  className?: string;
};

const ModalContent = ({ children, theme, className }: PropTypes) => {
  const classes = twMerge(
    'w-[600px] h-[380px] bg-finnieGray text-center',
    theme === Theme.Dark && 'bg-finnieBlue-light-secondary',
    className
  );

  return <div className={classes}>{children}</div>;
};

export default memo(ModalContent);
