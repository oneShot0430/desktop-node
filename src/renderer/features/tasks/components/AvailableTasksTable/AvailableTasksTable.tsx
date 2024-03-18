import { useAutoAnimate } from '@formkit/auto-animate/react';
import React from 'react';

import EmptyAvailableTasks from 'assets/animations/empty-available-tasks.gif';
import LoadingAvailableTasks from 'assets/animations/loading-available-tasks.gif';
import {
  AVAILABLE_TASKS_REFETCH_INTERVAL,
  AVAILABLE_TASKS_STALE_TIME,
} from 'config/refetchIntervals';
import { InfiniteScrollTable } from 'renderer/components/ui';
import { useAvailableTasks } from 'renderer/features';

import { AdvancedOptions } from '../AdvancedOptions/AdvancedOptions';
import TaskItem from '../AvailableTaskRow/AvailableTaskRow';

const tableHeaders = [
  { title: 'Info' },
  { title: 'Task Name', alignLeft: true },
  { title: '' },
  { title: '' },
  { title: '' },
  { title: '' },
  { title: 'Stake' },
  { title: 'Extensions' },
  { title: 'Run Task' },
];

const columnsLayout = 'grid-cols-available-tasks place-items-center';
const addPrivateTaskColumnsLayout =
  'grid-cols-add-private-task place-items-center';
const pageSize = 10;

export function AvailableTasksTable() {
  const {
    allRows,
    isLoadingTasks,
    isFetchingNextTasks,
    tasksError,
    hasMoreTasks,
    fetchNextTasks,
  } = useAvailableTasks({
    pageSize,
    refetchInterval: AVAILABLE_TASKS_REFETCH_INTERVAL,
    staleTime: AVAILABLE_TASKS_STALE_TIME,
  });

  const [animationRef] = useAutoAnimate();

  const thereAreNoTasks =
    !isLoadingTasks && !isFetchingNextTasks && !hasMoreTasks && !allRows.length;
  const showLoader = (isLoadingTasks || isFetchingNextTasks) && !allRows.length;

  return (
    <div className="relative flex flex-col flex-grow w-full h-0 min-h-0">
      <InfiniteScrollTable
        animationRef={animationRef}
        isFetchingNextPage={isFetchingNextTasks}
        columnsLayout={columnsLayout}
        headers={tableHeaders}
        isLoading={isLoadingTasks}
        error={tasksError as Error}
        hasMore={!!hasMoreTasks}
        update={fetchNextTasks}
        items={allRows.length}
      >
        {showLoader && (
          <div className="flex items-center justify-center w-full h-full text-white">
            <div className="w-[363px] h-[363px] flex flex-col justify-center items-center">
              <img src={LoadingAvailableTasks} alt="No available tasks" />
            </div>
          </div>
        )}

        {thereAreNoTasks && (
          <div className="flex items-center justify-center w-full h-full text-white">
            <div className="w-[363px] h-[363px] flex flex-col justify-center items-center">
              <img src={EmptyAvailableTasks} alt="No available tasks" />
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
      <AdvancedOptions columnsLayout={addPrivateTaskColumnsLayout} />
    </div>
  );
}
