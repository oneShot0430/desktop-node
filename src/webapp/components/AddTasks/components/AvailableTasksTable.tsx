import React, { memo, useState } from 'react';
import { useInfiniteQuery } from 'react-query';

import { InfiniteScrollTable } from 'webapp/components/ui';
import { fetchAvailableTasks, QueryKeys } from 'webapp/services';
import { Task } from 'webapp/types';

import AvailableTaskRow from './AvailableTaskRow';

const tableHeaders = [
  'Code',
  'TaskName ',
  'Creator',
  'Bounty',
  'Nodes',
  'Top Stake',
  'Set Stake',
  'Run Task',
];

const pageSize = 10;

const AvailableTasksTable = () => {
  const [hasMore, setHasMore] = useState(true);

  const { data, isLoading, error, fetchNextPage } = useInfiniteQuery<
    Task[],
    Error
  >(
    QueryKeys.availableTaskList,
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

  const getAllRows = (): Task[] => {
    return (data?.pages || []).flat();
  };

  return (
    <InfiniteScrollTable
      tableHeaders={tableHeaders}
      isLoading={isLoading}
      error={error}
      hasMore={hasMore}
      update={fetchNextPage}
    >
      {getAllRows().map((task) => (
        <AvailableTaskRow key={task.publicKey} task={task} />
      ))}
    </InfiniteScrollTable>
  );
};

export default memo(AvailableTasksTable);
