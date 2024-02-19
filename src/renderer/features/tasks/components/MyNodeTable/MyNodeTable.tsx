import { Button, ButtonSize, ButtonVariant } from '@_koii/koii-styleguide';
import Lottie from '@novemberfiveco/lottie-react-light';
import React, { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';

import EmptyMyNode from 'assets/animations/empty-my-node.json';
import {
  MY_NODE_TASK_REFETCH_INTERVAL,
  MY_NODE_TASK_STALE_TIME,
} from 'config/refetchIntervals';
import { InfiniteScrollTable, LoadingSpinner } from 'renderer/components/ui';
import { useMyNodeContext, usePrivateTasks } from 'renderer/features';
import { useStartedTasks } from 'renderer/features/common/hooks/useStartedTasks';
// import { useStartedTasks } from 'renderer/features/tasks/hooks/useStartedTasks';
import { getMainAccountPublicKey, QueryKeys } from 'renderer/services';
import { AppRoute } from 'renderer/types/routes';

import { MyNodeTaskRow } from '../MyNodeTaskRow';

const tableHeaders = [
  { title: 'Run' },
  { title: 'Task Info', alignLeft: true },
  { title: '' },
  { title: '' },
  { title: '' },
  { title: '' },
  { title: '' },
  { title: 'Rewards' },
  { title: 'Status' },
  { title: 'Menu' },
];

const columnsLayout = 'grid-cols-my-node place-items-center';
const pageSize = 10;

export function MyNodeTable() {
  const tableRef = useRef<HTMLDivElement>(null);

  const { data: mainAccountPubKey, isLoading: isLoadingMainAccount } = useQuery(
    QueryKeys.MainAccount,
    getMainAccountPublicKey
  );
  const { privateTasksQuery } = usePrivateTasks();
  const { fetchMyTasksEnabled } = useMyNodeContext();

  const privateTasksLoaded = privateTasksQuery.isSuccess;
  const privateTasksList = privateTasksQuery.data || [];

  const {
    isFetchingNextTasks,
    isLoadingTasks,
    tasksError,
    hasMoreTasks,
    fetchNextTasks,
    allRows,
  } = useStartedTasks({
    pageSize,
    refetchInterval: MY_NODE_TASK_REFETCH_INTERVAL,
    staleTime: MY_NODE_TASK_STALE_TIME,
    enabled: fetchMyTasksEnabled && privateTasksLoaded,
  });

  const navigate = useNavigate();

  const goToAvailableTasks = () => navigate(AppRoute.AddTask);
  const goToSettings = () => navigate(AppRoute.SettingsHelp);
  const thereAreNoTasks = !isLoadingTasks && !allRows.length;

  const queryClient = useQueryClient();

  useEffect(() => {
    window.main.onSystemWakeUp(() => {
      queryClient.invalidateQueries([QueryKeys.TaskList]);
    });
  }, [queryClient]);

  return (
    <div ref={tableRef} className="relative flex flex-col flex-grow w-full h-0">
      <InfiniteScrollTable
        isFetchingNextPage={isFetchingNextTasks}
        columnsLayout={columnsLayout}
        headers={tableHeaders}
        minHeight="min-h-[500px]"
        isLoading={isLoadingTasks || isLoadingMainAccount}
        error={tasksError as Error}
        hasMore={!!hasMoreTasks}
        update={fetchNextTasks}
      >
        {isLoadingTasks && (
          <LoadingSpinner className="w-40 h-40 mx-auto mt-40" />
        )}

        {thereAreNoTasks && (
          <div className="flex flex-col items-center mx-auto text-sm text-white mt-14">
            <Lottie animationData={EmptyMyNode} className="w-66" />
            <p className="mb-4">
              {/* eslint-disable-next-line @cspell/spellchecker */}
              You aren&apos;t running any tasks right now. Let&apos;s fix that!
            </p>
            <div className="flex flex-row">
              <Button
                onClick={goToAvailableTasks}
                variant={ButtonVariant.Secondary}
                size={ButtonSize.SM}
                label="Available Tasks"
                buttonClassesOverrides="!border-white !text-white mr-4"
              />
              <Button
                onClick={goToSettings}
                variant={ButtonVariant.Secondary}
                size={ButtonSize.SM}
                label="Need Help?"
                buttonClassesOverrides="!border-white !text-white ml-4"
              />
            </div>
          </div>
        )}

        {allRows.map((task, index) => {
          const isPrivate = privateTasksList.includes(task.publicKey);
          return (
            <div key={task.publicKey}>
              <MyNodeTaskRow
                key={task.publicKey}
                index={index}
                task={task}
                accountPublicKey={mainAccountPubKey as string}
                columnsLayout={columnsLayout}
                isPrivate={isPrivate}
                tableRef={tableRef}
              />
            </div>
          );
        })}
        <div className="pt-2 text-right">
          <a
            className="text-sm underline cursor-pointer text-green-2"
            onClick={goToSettings}
          >
            Need Help?
          </a>
        </div>
      </InfiniteScrollTable>
    </div>
  );
}
