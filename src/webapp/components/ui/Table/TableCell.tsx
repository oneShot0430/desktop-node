import React from 'react';
import { twMerge } from 'tailwind-merge';

export const TableCell = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const classes = twMerge(
    'pt-2 align-middle h-[60px] border-gray-700 border-b-[0.5px]',
    className
  );
  return <td className={classes}>{children}</td>;
};
