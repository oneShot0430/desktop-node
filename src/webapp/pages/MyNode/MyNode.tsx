import React from 'react';

import TasksTable from 'webapp/components/TasksTable';

import MyNodeToolbar from './MyNodeToolbar';

const MyNode = (): JSX.Element => {
  return (
    <>
      <MyNodeToolbar />
      <TasksTable />
    </>
  );
};

export default MyNode;
