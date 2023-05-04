import { QueryKeys, fetchAvailableTasks } from 'renderer/services';

import { useTasksInfiniteScroll } from './useTaskInfinitieScroll';

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
  });
};