import React, { ReactNode } from 'react';

import { ColumnsLayout } from './TableHeaders';

interface Props {
  children: ReactNode;
  columnsLayout: ColumnsLayout;
  className?: string;
}

export const TableRow = ({
  children,
  columnsLayout,
  className = '',
}: Props) => {
  const classes = `grid gap-4 text-white items-center text-sm border-gray-700 border-b-[0.5px] align-middle pt-1.5 ${className} ${columnsLayout}`;

  return <div className={classes}>{children}</div>;
};
