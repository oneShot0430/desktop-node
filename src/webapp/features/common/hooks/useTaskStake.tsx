import { useQuery } from 'react-query';

import { QueryKeys, TaskService } from 'webapp/services';
import { Task } from 'webapp/types';

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
