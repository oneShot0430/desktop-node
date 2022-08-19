import React from 'react';
import { twMerge } from 'tailwind-merge';

import { TableHeader } from './TableHeader';

type PropsType = {
  tableHeaders: string[];
  children: React.ReactNode;
  isLoading?: boolean;
  error?: string;
  height?: string;
};

export const Table = ({
  children,
  tableHeaders,
  isLoading,
  error,
  height,
}: PropsType) => {
  const tableClasses = twMerge(
    'h-[74vh] overflow-y-auto overflow-x-auto',
    height && `h-[${height}]`
  );
  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  return (
    <div className={tableClasses}>
      <table className="w-full text-[14px] text-left table-auto overflow-y-auto h-[200px] border-separate border-spacing-0">
        <TableHeader tableHeaders={tableHeaders} />
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};
