import React, { useState } from 'react';
import { useInfiniteQuery, useQuery } from 'react-query';

import { DetailedErrorType } from 'models';
import {
  fetchMyTasks,
  getMainAccountPublicKey,
  QueryKeys,
} from 'webapp/services';
import { Task } from 'webapp/types';

import { InfiniteScrollTable } from '../ui';

import { TaskRow } from './components/TaskRow';

const tableHeaders = [
  'Start/Stop',
  'TaskName & Start Time',
  'Creator',
  'Earned',
  'Stake',
  'Status',
  'Actions',
];

const pageSize = 10;

export const MyNodeTable = () => {
  const [hasMore, setHasMore] = useState(true);

  const { data: mainAccountPubKey, isLoading: loadingMainAccount } = useQuery(
    QueryKeys.MainAccount,
    () => getMainAccountPublicKey()
  );

  const { isLoading, data, error, fetchNextPage } = useInfiniteQuery<
    Task[],
    DetailedErrorType
  >(
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

  const getAllRows = (): Task[] => {
    return (data?.pages || []).flat();
  };

  if (loadingMainAccount) return null;

  return (
    <InfiniteScrollTable
      tableHeaders={tableHeaders}
      isLoading={isLoading}
      error={error?.summary}
      hasMore={hasMore}
      update={fetchNextPage}
    >
      {getAllRows().map((task) => (
        <TaskRow
          key={task.publicKey}
          task={task}
          accountPublicKey={mainAccountPubKey}
        />
      ))}
    </InfiniteScrollTable>
  );
};
