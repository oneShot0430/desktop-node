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
  return (
    <table className="w-full text-[14px] text-left table-auto">
      <TableHeader tableHeaders={tableHeaders} />
      {isLoading && <div>Loading...</div>}
      {error ? error : null}
      <tbody>{children}</tbody>
    </table>
  );
};
