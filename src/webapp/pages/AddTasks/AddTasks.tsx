import React from 'react';

import AddTasksTasksTable from './components/AddTasksTasksTable';
import AddTasksToolbar from './components/AddTasksToolbar';

const AddTasks = (): JSX.Element => {
  return (
    <>
      <AddTasksToolbar />
      <div className="mt-34.5">
        <AddTasksTasksTable />
      </div>
    </>
  );
};

export default AddTasks;
