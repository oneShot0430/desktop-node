import React from 'react';
import { useQuery } from 'react-query';

import { TASK_REFETCH_INTERVAL } from 'config/refetchIntervals';
import { InfiniteScrollTable } from 'renderer/components/ui';
import { useStartedTasks } from 'renderer/features/common/hooks/useStartedTasks';
import { getMainAccountPublicKey, QueryKeys } from 'renderer/services';

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
    isFetchingNextTasks,
    isLoadingTasks,
    tasksError,
    hasMoreTasks,
    fetchNextTasks,
    allRows,
  } = useStartedTasks({
    pageSize,
    refetchInterval: TASK_REFETCH_INTERVAL,
  });

  return (
    <InfiniteScrollTable
      isFetchingNextPage={isFetchingNextTasks}
      columnsLayout={columnsLayout}
      headers={tableHeaders}
      isLoading={isLoadingTasks || isLoadingMainAccount}
      error={tasksError as Error}
      hasMore={!!hasMoreTasks}
      update={fetchNextTasks}
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
