import React from 'react';

import { TableHeader } from './TableHeader';

export type PropsType = {
  tableHeaders: string[];
  children: React.ReactNode;
  isLoading?: boolean;
  error?: string;
};

export const Table = ({
  children,
  tableHeaders,
  isLoading,
  error,
}: PropsType) => {
  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  return (
    <div className="h-[67vh] overflow-y-auto overflow-x-auto">
      <table className="w-full text-[14px] text-left table-auto overflow-y-auto h-[200px] border-separate border-spacing-0">
        <TableHeader tableHeaders={tableHeaders} />
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};
