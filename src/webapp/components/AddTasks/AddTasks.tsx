import React from 'react';
import { useQuery } from 'react-query';

import { fetchAllTasks, QueryKeys } from 'webapp/services';

import AvailableTasksTable from './components/AvailableTasksTable';

const AddTasks = (): JSX.Element => {
  const { data: tasks, isLoading } = useQuery(
    QueryKeys.taskList,
    fetchAllTasks
  );

  return (
    <div>
      <AvailableTasksTable tasks={tasks} isLoading={isLoading} />
    </div>
  );
};

export default AddTasks;
