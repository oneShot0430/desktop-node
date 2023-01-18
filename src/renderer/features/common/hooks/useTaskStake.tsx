import { useQuery } from 'react-query';

import { QueryKeys, TaskService } from 'renderer/services';
import { Task } from 'renderer/types';

type UseMyStakeParamsType = {
  task: Task;
  publicKey?: string;
};

export const useTaskStake = ({ task }: UseMyStakeParamsType) => {
  const {
    data: taskStake = 0,
    isLoading,
    error,
  } = useQuery([QueryKeys.TaskStake, task.publicKey], () =>
    TaskService.getMyStake(task)
  );

  return {
    taskStake,
    loadingTaskStake: isLoading,
    loadingTaskStakeError: error,
  };
};
