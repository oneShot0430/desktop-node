import React from 'react';

import AvailableTasksTable from './components/AvailableTasksTable';

const AddTasks = (): JSX.Element => {
  return (
    <div className="relative h-full overflow-y-auto">
      <AvailableTasksTable />
    </div>
  );
};

export default AddTasks;
