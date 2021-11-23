import React from 'react';

import Modal from 'webapp/components/Modal';

import AddTasksTasksTable from './components/AddTasksTasksTable';
import AddTasksToolbar from './components/AddTasksToolbar';

const AddTasks = (): JSX.Element => {
  return (
    <>
      <Modal />
      <AddTasksToolbar />
      <div className="mt-34.5">
        <AddTasksTasksTable />
      </div>
    </>
  );
};

export default AddTasks;
