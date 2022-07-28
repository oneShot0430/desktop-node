import React from 'react';

import { TableHeader } from './TableHeader';

type PropsType = {
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
    <table className="w-full text-[14px] text-left table-auto overflow-hidden">
      <TableHeader tableHeaders={tableHeaders} />
      <tbody>{children}</tbody>
    </table>
  );
};
