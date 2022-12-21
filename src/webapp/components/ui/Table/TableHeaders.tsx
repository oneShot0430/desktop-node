import React from 'react';

import { Tooltip } from 'webapp/components';

export interface TableHeader {
  title: string;
  tooltip?: string;
}

export type ColumnsLayout = `grid-cols-${string}`;

interface PropsType {
  headers: TableHeader[];
  columnsLayout: ColumnsLayout;
}

export const TableHeaders = ({ headers, columnsLayout }: PropsType) => {
  const containerClasses = `grid mb-4 pb-2 font-semibold leading-5 text-sm text-white border-b-2 border-white gap-4 ${columnsLayout}`;

  return (
    <div className={containerClasses}>
      {headers.map(({ title, tooltip }) => (
        <div key={title} className="font-semibold text-white">
          {tooltip ? (
            <Tooltip placement="top-right" tooltipContent={tooltip}>
              {title}
            </Tooltip>
          ) : (
            title
          )}
        </div>
      ))}
    </div>
  );
};
