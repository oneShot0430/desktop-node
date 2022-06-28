import React from 'react';

export const TableCell = ({
  children,
  width,
}: {
  children: React.ReactNode;
  width?: number;
}) => (
  <td className={`w-${width ? `${width}px` : 'auto'} pt-2 align-middle`}>
    {children}
  </td>
);
