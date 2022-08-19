import React, { useState } from 'react';
import { useInfiniteQuery } from 'react-query';

import { fetchMyTasks, QueryKeys } from 'webapp/services';
import { Task } from 'webapp/types';

import { InfiniteScrollTable } from '../ui/Table';

import { TaskRow } from './components/TaskRow';

const tableHeaders = [
  'Start/Stop',
  'TaskName & Start Time',
  'Creator',
  'Earned',
  'Stake',
  'Status',
  'Actions',
];

const pageSize = 10;

export const MyNodeTable = () => {
  const [hasMore, setHasMore] = useState(true);

  const { isLoading, data, error, fetchNextPage } = useInfiniteQuery(
    QueryKeys.taskList,
    ({ pageParam = 1 }) => {
      console.log('FETCHING PAGE ', pageParam);
      return fetchMyTasks({ limit: pageSize, offset: pageParam * pageSize });
    },
    {
      getNextPageParam: (lastPageData, allPages) => {
        const checkHasMore = lastPageData.length > 0;
        if (hasMore !== checkHasMore) {
          setHasMore(checkHasMore);
        }
        return checkHasMore ? allPages.length + 1 : undefined;
      },
    }
  );

  const getAllRows = (): Task[] => {
    return (data?.pages || []).flat();
  };

  return (
    <InfiniteScrollTable
      tableHeaders={tableHeaders}
      isLoading={isLoading}
      error={error as string}
      hasMore={hasMore}
      update={fetchNextPage}
    >
      {getAllRows().map((task) => (
        <TaskRow key={task.publicKey} task={task} />
      ))}
    </InfiniteScrollTable>
  );
};
