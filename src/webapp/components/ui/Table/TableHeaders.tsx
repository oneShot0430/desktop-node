import React from 'react';

import { Tooltip } from 'webapp/components';

export interface TableHeader {
  title: string;
  tooltip?: string;
}

interface PropsType {
  headers: TableHeader[];
}

export const TableHeaders = ({ headers }: PropsType) => (
  <thead className="sticky top-0 z-10 w-full pb-8 font-semibold">
    <tr className="border-b-2 border-gray-500">
      {headers.map(({ title, tooltip }) =>
        tooltip ? (
          <th className="font-semibold leading-5 text-white racking-[0.03em] pb-4 border-b-2 border-gray-500">
            <Tooltip placement="bottom-right" tooltipContent={tooltip}>
              {title}
            </Tooltip>
          </th>
        ) : (
          <th className="font-semibold leading-5 text-white racking-[0.03em] pb-4 border-b-2 border-gray-500">
            {title}
          </th>
        )
      )}
    </tr>
  </thead>
);
