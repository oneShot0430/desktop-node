import { useAutoAnimate } from '@formkit/auto-animate/react';
import React, { useMemo } from 'react';

import NoAvailbleTasks from 'assets/svgs/no-available-tasks.svg';
import { TASK_REFETCH_INTERVAL } from 'config/refetchIntervals';
import isEmpty from 'lodash/isEmpty';
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

  const hasNoTasks = useMemo(() => {
    return !isLoadingTasks && isEmpty(allRows);
  }, [allRows, isLoadingTasks]);

  return (
    <div style={{ height: 'calc(100% - 60px)' }}>
      <InfiniteScrollTable
        animationRef={animationRef}
        isFetchingNextPage={isFetchingNextTasks}
        columnsLayout={columnsLayout}
        headers={tableHeaders}
        isLoading={isLoadingTasks}
        error={tasksError as Error}
        hasMore={!!hasMoreTasks}
        update={fetchNextTasks}
      >
        {hasNoTasks && !hasMoreTasks && (
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
      <AdvancedOptions columnsLayout={addPrivateTaskColumnsLayout} />
    </div>
  );
}
