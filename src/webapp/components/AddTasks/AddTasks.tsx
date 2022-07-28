import React from 'react';
import { useQuery } from 'react-query';

import { fetchAvailableTasks, QueryKeys } from 'webapp/services';

import AvailableTasksTable from './components/AvailableTasksTable';

const AddTasks = (): JSX.Element => {
  const { data: tasks, isLoading } = useQuery(QueryKeys.availableTaskList, () =>
    fetchAvailableTasks({ offset: 1, limit: 10 })
  );

  return (
    <div>
      <AvailableTasksTable tasks={tasks} isLoading={isLoading} />
    </div>
  );
};

export default AddTasks;
