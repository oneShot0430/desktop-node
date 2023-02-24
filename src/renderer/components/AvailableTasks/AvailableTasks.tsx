import React, { useState } from 'react';
import { useInfiniteQuery } from 'react-query';

import { InfiniteScrollTable } from 'renderer/components/ui';
import { fetchAvailableTasks, QueryKeys } from 'renderer/services';
import { Task } from 'renderer/types';

import TaskItem from './components/TaskItem';

const tableHeaders = [
  { title: 'Info' },
  { title: 'Task Name & Start Time' },
  { title: '' },
  { title: '' },
  { title: 'Stake' },
  { title: 'Settings' },
  { title: 'Run Task' },
];

const columnsLayout = 'grid-cols-available-tasks';
const pageSize = 10;

export function AvailableTasks() {
  const [hasMore, setHasMore] = useState(true);

  const { data, isLoading, error, fetchNextPage } = useInfiniteQuery<
    Task[],
    Error
  >(
    [QueryKeys.availableTaskList],
    ({ pageParam = 0 }) =>
      fetchAvailableTasks({ limit: pageSize, offset: pageParam * pageSize }),
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

  const allRows = (data?.pages || []).flat();

  return (
    <InfiniteScrollTable
      columnsLayout={columnsLayout}
      headers={tableHeaders}
      isLoading={isLoading}
      error={error}
      hasMore={hasMore}
      update={fetchNextPage}
    >
      {allRows.map((task, index) => (
        <TaskItem
          columnsLayout={columnsLayout}
          key={task.publicKey}
          index={index}
          task={task}
        />
      ))}
    </InfiniteScrollTable>
  );
}
