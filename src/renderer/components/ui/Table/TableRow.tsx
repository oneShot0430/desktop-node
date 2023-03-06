import React, { ReactNode, forwardRef } from 'react';

import { ColumnsLayout } from './TableHeaders';

interface Props {
  children: ReactNode;
  columnsLayout: ColumnsLayout;
  className?: string;
}

export const TableRow = forwardRef<HTMLDivElement, Props>(
  ({ children, columnsLayout, className = '' }, ref) => {
    const classes = `grid gap-4 text-white items-center text-sm border-white border-b align-middle items-center  ${className} ${columnsLayout}`;

    return (
      <div ref={ref} className={classes}>
        {children}
      </div>
    );
  }
);

TableRow.displayName = 'TableRow';
