import { QueryKeys, fetchMyTasks } from 'renderer/services';

import { useTasksInfiniteScroll } from './useTaskInfinitieScroll';

type UseTasksInfiniteScrollParams = {
  pageSize: number;
  refetchInterval?: number;
};

export const useStartedTasks = ({
  pageSize,
  refetchInterval,
}: UseTasksInfiniteScrollParams) => {
  return useTasksInfiniteScroll({
    queryKey: QueryKeys.taskList,
    pageSize,
    refetchInterval,
    fetchFunction: fetchMyTasks,
  });
};
