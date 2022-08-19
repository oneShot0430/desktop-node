import React from 'react';

import { MyNodeTable } from 'webapp/components/MyNodeTable/MyNodeTable';

const MyNode = (): JSX.Element => {
  return (
    <div className="relative overflow-y-auto h-full">
      <MyNodeTable />
    </div>
  );
};

export default MyNode;
