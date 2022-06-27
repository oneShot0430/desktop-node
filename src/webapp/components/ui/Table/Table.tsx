import React from 'react';

import { TableHeader } from './TableHeader';

export type PropsType = {
  tableHeaders: string[];
  children: React.ReactNode;
};

export const Table = ({ children, tableHeaders }: PropsType) => {
  return (
    <table className="w-full text-[14px] text-left table-auto">
      <TableHeader tableHeaders={tableHeaders} />
      <tbody>{children}</tbody>
    </table>
  );
};
