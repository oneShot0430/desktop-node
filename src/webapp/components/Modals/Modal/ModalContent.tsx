import React, { memo } from 'react';
import { twMerge } from 'tailwind-merge';

type PropTypes = {
  children: React.ReactNode;
  onClose?: () => void;
  theme?: 'dark' | 'light';
  className?: string;
};

const ModalContent = ({ children, onClose, theme, className }: PropTypes) => {
  const classes = twMerge(
    'w-[600px] h-[380px] bg-finnieGray text-center',
    theme === 'dark' && 'bg-finnieBlue-light-secondary',
    className
  );

  return <div className={classes}>{children}</div>;
};
export default memo(ModalContent);
