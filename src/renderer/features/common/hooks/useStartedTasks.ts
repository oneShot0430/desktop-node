import { QueryKeys, fetchMyTasks } from 'renderer/services';

import { useTasksInfiniteScroll } from './useTaskInfinitieScroll';

type UseTasksInfiniteScrollParams = {
  pageSize: number;
  refetchInterval?: number;
  enabled?: boolean;
};

export const useStartedTasks = ({
  pageSize,
  refetchInterval,
  enabled,
}: UseTasksInfiniteScrollParams) => {
  return useTasksInfiniteScroll({
    queryKey: QueryKeys.taskList,
    pageSize,
    refetchInterval,
    fetchFunction: fetchMyTasks,
    enabled,
  });
};
