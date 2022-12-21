import React, { useState } from 'react';
import { useInfiniteQuery, useQuery } from 'react-query';

import { InfiniteScrollTable } from 'webapp/components';
import {
  fetchMyTasks,
  getMainAccountPublicKey,
  QueryKeys,
} from 'webapp/services';
import { Task } from 'webapp/types';

import { TaskItem } from './components/TaskItem';

const tableHeaders = [
  { title: 'Start/Stop' },
  { title: '' },
  { title: 'Task Name & Start Time' },
  { title: 'Creator' },
  {
    title: 'Earned',
    tooltip: 'Total KOII earned for running this Task',
  },
  { title: 'Stake' },
  { title: 'Status' },
  { title: 'Actions' },
];

const columnsLayout = 'grid-cols-my-node';
const pageSize = 10;

export const MyNode = () => {
  const [hasMore, setHasMore] = useState(true);

  const { data: mainAccountPubKey, isLoading: isLoadingMainAccount } = useQuery(
    QueryKeys.MainAccount,
    () => getMainAccountPublicKey()
  );

  const {
    isLoading: isLoadingTasks,
    data,
    error,
    fetchNextPage,
  } = useInfiniteQuery<Task[], Error>(
    QueryKeys.taskList,
    ({ pageParam = 0 }) =>
      fetchMyTasks({ limit: pageSize, offset: pageParam * pageSize }),
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
      isLoading={isLoadingTasks || isLoadingMainAccount}
      error={error}
      hasMore={hasMore}
      update={fetchNextPage}
    >
      {allRows.map((task, index) => (
        <TaskItem
          key={task.publicKey}
          index={index}
          task={task}
          accountPublicKey={mainAccountPubKey}
          columnsLayout={columnsLayout}
        />
      ))}
    </InfiniteScrollTable>
  );
};
