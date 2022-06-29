import React from 'react';
import { useQuery } from 'react-query';

import { MyNodeTable } from 'webapp/components/MyNodeTable/MyNodeTable';
import { fetchTasks } from 'webapp/services/api';

const MyNode = (): JSX.Element => {
  const { isLoading, data: tasks, error } = useQuery('tasks', fetchTasks);

  return (
    <div className="relative overflow-x-auto">
      <MyNodeTable
        tasks={tasks}
        isLoading={isLoading}
        error={error as string}
      />
    </div>
  );
};

export default MyNode;
