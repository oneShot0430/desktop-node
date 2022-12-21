import React, { ReactNode } from 'react';

import {
  ErrorMessage,
  LoadingSpinner,
  LoadingSpinnerSize,
} from 'webapp/components';

import { TableHeaders, TableHeader, ColumnsLayout } from './TableHeaders';

type PropsType = {
  headers: TableHeader[];
  columnsLayout: ColumnsLayout;
  children: ReactNode;
  isLoading?: boolean;
  error?: string | Error;
};

export const Table = ({
  headers,
  columnsLayout,
  children,
  isLoading,
  error,
}: PropsType) => {
  if (isLoading)
    return (
      <div className="grid place-items-center h-full">
        <LoadingSpinner size={LoadingSpinnerSize.Large} />
      </div>
    );

  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="flex flex-col flex-grow h-full min-h-0">
      <TableHeaders headers={headers} columnsLayout={columnsLayout} />
      <div className="overflow-y-auto min-h-table">{children}</div>
    </div>
  );
};
