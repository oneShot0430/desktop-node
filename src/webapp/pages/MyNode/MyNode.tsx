import React from 'react';

import MyNodeTasksTable from './components/MyNodeTasksTable';
import MyNodeToolbar from './components/MyNodeToolbar';

const MyNode = (): JSX.Element => {
  return (
    <>
      <MyNodeToolbar />
      <div className="mt-34.5">
        <MyNodeTasksTable />
      </div>
    </>
  );
};

export default MyNode;
