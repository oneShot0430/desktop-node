import React from 'react';

type PropsType = {
  tableHeaders: string[];
};

// border-b-2 border-gray-500

export const TableHeader = ({ tableHeaders }: PropsType) => {
  return (
    <thead className="sticky top-0 z-10 w-full pb-8 font-semibold">
      <tr className="border-b-2 border-gray-500">
        {tableHeaders.map((headerText) => (
          <th
            key={headerText}
            className="font-semibold leading-5 text-white racking-[0.03em] pb-4 border-b-2 border-gray-500"
          >
            {headerText}
          </th>
        ))}
      </tr>
    </thead>
  );
};
