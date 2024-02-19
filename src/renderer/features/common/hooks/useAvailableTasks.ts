import { QueryKeys, fetchAvailableTasks } from 'renderer/services';

import { useTasksInfiniteScroll } from './useTaskInfiniteScroll';

type UseAvailableTasksParams = {
  pageSize: number;
  refetchInterval?: number;
  staleTime?: number;
};

export const useAvailableTasks = ({
  pageSize,
  refetchInterval,
  staleTime,
}: UseAvailableTasksParams) => {
  return useTasksInfiniteScroll({
    queryKey: QueryKeys.availableTaskList,
    pageSize,
    refetchInterval,
    fetchFunction: fetchAvailableTasks,
    staleTime,
  });
};
