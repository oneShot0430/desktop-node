import { Button, ButtonSize, ButtonVariant } from '@_koii/koii-styleguide';
import Lottie from '@novemberfiveco/lottie-react-light';
import React from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';

import EmptyMyNode from 'assets/animations/empty-my-node.json';
import { TASK_REFETCH_INTERVAL } from 'config/refetchIntervals';
import { InfiniteScrollTable } from 'renderer/components/ui';
import { useMyNodeContext } from 'renderer/features';
import { useStartedTasks } from 'renderer/features/common/hooks/useStartedTasks';
import { getMainAccountPublicKey, QueryKeys } from 'renderer/services';
import { AppRoute } from 'renderer/types/routes';

import { TaskItem } from './components/TaskItem';

const tableHeaders = [
  { title: 'Run' },
  { title: 'Task Info', alignLeft: true },
  { title: '' },
  {
    title: '',
  },
  { title: 'Rewards' },
  { title: 'Round' },
  { title: 'Status' },
  { title: 'Options' },
];

const columnsLayout = 'grid-cols-my-node place-items-center';
const pageSize = 10;

export function MyNode() {
  const { data: mainAccountPubKey, isLoading: isLoadingMainAccount } = useQuery(
    QueryKeys.MainAccount,
    getMainAccountPublicKey
  );

  const { fetchMyTasksEnabled } = useMyNodeContext();

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
    enabled: fetchMyTasksEnabled,
  });

  const navigate = useNavigate();

  const goToAvailableTasks = () => navigate(AppRoute.AddTask);
  const thereAreNoTasks = !isLoadingTasks && !allRows.length;

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
      {thereAreNoTasks && (
        <div className="text-white mx-auto mt-14 flex flex-col items-center text-sm">
          <Lottie animationData={EmptyMyNode} className="w-66" />
          <p className="mb-4">
            You aren&apos;t runing any tasks right now. Let&apos;s fix that!
          </p>

          <Button
            onClick={goToAvailableTasks}
            variant={ButtonVariant.Secondary}
            size={ButtonSize.SM}
            label="Available Tasks"
            buttonClassesOverrides="!border-white !text-white"
          />
        </div>
      )}
      {allRows.map((task, index) => (
        <TaskItem
          key={task.publicKey}
          index={index}
          task={task}
          accountPublicKey={mainAccountPubKey as string}
          columnsLayout={columnsLayout}
          totalItems={allRows.length}
        />
      ))}
    </InfiniteScrollTable>
  );
}
