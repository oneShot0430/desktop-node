import { useQuery } from 'react-query';

import { QueryKeys, TaskService } from 'renderer/services';
import { Task } from 'renderer/types';

type UseMyStakeParamsType = {
  task: Task;
  publicKey?: string;
  enabled?: boolean;
};

export const useTaskStake = ({ task, enabled }: UseMyStakeParamsType) => {
  const {
    data: taskStake = 0,
    isLoading,
    error,
  } = useQuery(
    [QueryKeys.TaskStake, task.publicKey],
    () => TaskService.getMyStake(task),
    { enabled }
  );

  return {
    taskStake,
    loadingTaskStake: isLoading,
    loadingTaskStakeError: error,
  };
};
