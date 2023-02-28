import React, { ReactNode } from 'react';

import { ColumnsLayout } from './TableHeaders';

interface Props {
  children: ReactNode;
  columnsLayout: ColumnsLayout;
  className?: string;
}

export function TableRow({ children, columnsLayout, className = '' }: Props) {
  const classes = `grid gap-4 text-white items-center text-sm border-white border-b align-middle items-center  ${className} ${columnsLayout}`;

  return <div className={classes}>{children}</div>;
}
