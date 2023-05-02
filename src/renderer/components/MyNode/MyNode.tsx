import React from 'react';
import { useInfiniteQuery, useQuery } from 'react-query';

import { InfiniteScrollTable } from 'renderer/components/ui';
import {
  fetchMyTasks,
  getMainAccountPublicKey,
  QueryKeys,
} from 'renderer/services';
import { Task } from 'renderer/types';

import { TaskItem } from './components/TaskItem';

const tableHeaders = [
  { title: 'Start / Stop' },
  { title: 'Info' },
  { title: 'Task Name & Start Time', alignLeft: true },
  { title: 'Creator', alignLeft: true },
  {
    title: 'Earned',
    tooltip: 'Total KOII earned for running this Task',
  },
  { title: 'Stake' },
  { title: 'Round' },
  { title: 'Status' },
  { title: 'Add / Withdraw' },
];

const columnsLayout = 'grid-cols-my-node place-items-center';
const pageSize = 10;

export function MyNode() {
  const { data: mainAccountPubKey, isLoading: isLoadingMainAccount } = useQuery(
    QueryKeys.MainAccount,
    getMainAccountPublicKey
  );

  const {
    isLoading: isLoadingTasks,
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    QueryKeys.taskList,
    ({ pageParam = 0 }) => {
      return fetchMyTasks({ limit: pageSize, offset: pageParam * pageSize });
    },
    {
      getNextPageParam: (lastResponse, allPages) => {
        const hasMore = lastResponse.hasNext;
        const nextPage = allPages.length;

        return hasMore ? nextPage : undefined;
      },
    }
  );

  const allRows: Task[] = (data?.pages || [])
    .map(({ content }) => content)
    .flat();

  return (
    <InfiniteScrollTable
      isFetchingNextPage={isFetchingNextPage}
      columnsLayout={columnsLayout}
      headers={tableHeaders}
      isLoading={isLoadingTasks || isLoadingMainAccount}
      error={error as Error}
      hasMore={!!hasNextPage}
      update={fetchNextPage}
    >
      {allRows.map((task, index) => (
        <TaskItem
          key={task.publicKey}
          index={index}
          task={task}
          accountPublicKey={mainAccountPubKey as string}
          columnsLayout={columnsLayout}
        />
      ))}
    </InfiniteScrollTable>
  );
}
