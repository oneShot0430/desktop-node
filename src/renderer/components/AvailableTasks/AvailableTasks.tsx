import { useAutoAnimate } from '@formkit/auto-animate/react';
import React, { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import NoAvailbleTasks from 'assets/svgs/no-available-tasks.svg';
import isEmpty from 'lodash/isEmpty';
import { InfiniteScrollTable } from 'renderer/components/ui';
import { fetchAvailableTasks, QueryKeys } from 'renderer/services';
import { Task } from 'renderer/types';

import TaskItem from './components/TaskItem';

const tableHeaders = [
  { title: 'Info' },
  { title: 'Task Name & Start Time', alignLeft: true },
  { title: '' },
  { title: '' },
  { title: 'Round' },
  { title: 'Stake' },
  { title: 'Settings' },
  { title: 'Run Task' },
];

const columnsLayout = 'grid-cols-available-tasks place-items-center';
const pageSize = 10;

export function AvailableTasks() {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    [QueryKeys.availableTaskList],
    ({ pageParam = 0 }) => {
      return fetchAvailableTasks({
        limit: pageSize,
        offset: pageParam * pageSize,
      });
    },
    {
      getNextPageParam: (lastResponse, allPages) => {
        const hasMore = lastResponse.hasNext;
        const nextPage = allPages.length;

        return hasMore ? nextPage : undefined;
      },
    }
  );

  const [animationRef] = useAutoAnimate();

  const allRows: Task[] = (data?.pages || [])
    .map(({ content }) => content)
    .flat();

  const hasNoTasks = useMemo(() => {
    return !isLoading && isEmpty(allRows);
  }, [allRows, isLoading]);

  return (
    <InfiniteScrollTable
      animationRef={animationRef}
      isFetchingNextPage={isFetchingNextPage}
      columnsLayout={columnsLayout}
      headers={tableHeaders}
      isLoading={isLoading}
      error={error as Error}
      hasMore={!!hasNextPage}
      update={fetchNextPage}
    >
      {hasNoTasks && !hasNextPage && (
        <div className="w-full h-full flex justify-center items-center text-white mt-[50px]">
          <div className="w-[363px] h-[363px] flex flex-col justify-center items-center">
            <NoAvailbleTasks />
            <div className="text-center mt-[18px] text-sm">
              You are running all tasks that are currently available for your
              device. More tasks are added all the time, so check back soon!
            </div>
          </div>
        </div>
      )}

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
