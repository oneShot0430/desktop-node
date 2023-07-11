import { useQuery } from 'react-query';

import { QueryKeys, TaskService } from 'renderer/services';
import { Task } from 'renderer/types';

type UseMyStakeParamsType = {
  task: Task | undefined | null;
  publicKey?: string;
  enabled?: boolean;
};

export const useTaskStake = ({ task, enabled }: UseMyStakeParamsType) => {
  const {
    data: taskStake = 0,
    isLoading,
    error,
    refetch,
  } = useQuery(
    // adjust the key based on whether task is defined
    task ? [QueryKeys.TaskStake, task.publicKey] : '',
    // only perform the query if task is defined
    () => (task ? TaskService.getMyStake(task) : Promise.resolve(null)),
    { enabled, cacheTime: 0 }
  );

  return {
    refetchTaskStake: refetch,
    taskStake: taskStake || 0,
    loadingTaskStake: isLoading,
    loadingTaskStakeError: error,
  };
};
