import React from 'react';
import { useQuery } from 'react-query';

import { MyNodeTable } from 'webapp/components/MyNodeTable/MyNodeTable';
import { fetchTasks } from 'webapp/services/api';

const MyNode = (): JSX.Element => {
  const { isLoading, data, error } = useQuery('tasks', fetchTasks);

  return (
    <div className="relative overflow-x-auto">
      <MyNodeTable tasks={data} isLoading={isLoading} error={error as string} />

      {/* <div>
        <MyNodeTasksTable />
      </div> */}
    </div>
  );
};

export default MyNode;
