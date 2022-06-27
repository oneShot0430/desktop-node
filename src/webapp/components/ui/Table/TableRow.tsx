import React from 'react';

export const TableRow = ({ children }: { children: React.ReactNode }) => {
  return <tr className="text-white border-b-[1px]">{children}</tr>;
};
