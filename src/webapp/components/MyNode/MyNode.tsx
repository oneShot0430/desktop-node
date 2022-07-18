import React from 'react';
import { useQuery } from 'react-query';

import { MyNodeTable } from 'webapp/components/MyNodeTable/MyNodeTable';
import { QueryKeys, fetchMyTasks } from 'webapp/services';

const MyNode = (): JSX.Element => {
  const {
    isLoading,
    data: tasks,
    error,
  } = useQuery(QueryKeys.taskList, fetchMyTasks);

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
