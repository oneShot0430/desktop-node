import React from 'react';

import TasksTable from 'webapp/components/TasksTable';

import MyNodeToolbar from './MyNodeToolbar';

const MyNode = (): JSX.Element => {
  return (
    <>
      <MyNodeToolbar />
      <div className="mt-34.5">
        <TasksTable />
      </div>
    </>
  );
};

export default MyNode;
