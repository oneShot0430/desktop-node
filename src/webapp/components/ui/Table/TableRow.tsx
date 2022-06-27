import React from 'react';

export const TableRow = ({ children }: { children: React.ReactNode }) => {
  return (
    <tr className="text-white border-gray-700 border-b-[0.5px]">{children}</tr>
  );
};
