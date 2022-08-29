import React from 'react';

import { MyNodeTable } from 'webapp/components/MyNodeTable/MyNodeTable';

const MyNode = (): JSX.Element => {
  return (
    <div className="relative h-full overflow-y-auto">
      <MyNodeTable />
    </div>
  );
};

export default MyNode;
