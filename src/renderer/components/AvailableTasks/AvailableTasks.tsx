import { useAutoAnimate } from '@formkit/auto-animate/react';
import React from 'react';

import EmptyAvailableTasks from 'assets/animations/empty-available-tasks.gif';
import LoadingAvailableTasks from 'assets/animations/loading-available-tasks.gif';
import { TASK_REFETCH_INTERVAL } from 'config/refetchIntervals';
import { InfiniteScrollTable } from 'renderer/components/ui';
import { useAvailableTasks } from 'renderer/features';

import { AdvancedOptions } from './components/AdvancedOptions/AdvancedOptions';
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
const addPrivateTaskColumnsLayout =
  'grid-cols-add-private-task place-items-center';
const pageSize = 10;

export function AvailableTasks() {
  const {
    allRows,
    isLoadingTasks,
    isFetchingNextTasks,
    tasksError,
    hasMoreTasks,
    fetchNextTasks,
  } = useAvailableTasks({ pageSize, refetchInterval: TASK_REFETCH_INTERVAL });

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
