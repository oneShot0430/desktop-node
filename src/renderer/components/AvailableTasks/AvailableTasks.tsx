import React, { useMemo, useState } from 'react';
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

  const hasNoTasks = useMemo(() => {
    return !isLoading && isEmpty(allRows);
  }, [allRows, isLoading]);

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

      {hasNoTasks && (
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
    </InfiniteScrollTable>
  );
}
