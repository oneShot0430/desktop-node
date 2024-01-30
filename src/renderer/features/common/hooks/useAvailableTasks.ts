import { QueryKeys, fetchAvailableTasks } from 'renderer/services';

import { useTasksInfiniteScroll } from './useTaskInfiniteScroll';

type UseAvailableTasksParams = {
  pageSize: number;
  refetchInterval?: number;
};

export const useAvailableTasks = ({
  pageSize,
  refetchInterval,
}: UseAvailableTasksParams) => {
  return useTasksInfiniteScroll({
    queryKey: QueryKeys.availableTaskList,
    pageSize,
    refetchInterval,
    fetchFunction: fetchAvailableTasks,
    staleTime: 1000 * 60 * 5,
  });
};
