import React from 'react';

export type PropsType = {
  tableHeaders: string[];
};

export const TableHeader = ({ tableHeaders }: PropsType) => {
  return (
    <thead className="pb-8 font-semibold">
      <tr className="border-b-2 border-gray-500">
        {tableHeaders.map((headerText) => (
          <th
            key={headerText}
            className="font-semibold leading-5 text-white racking-[0.03em] pb-4"
          >
            {headerText}
          </th>
        ))}
      </tr>
    </thead>
  );
};
