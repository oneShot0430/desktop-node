import { useQuery } from 'react-query';

import { QueryKeys, TaskService } from 'renderer/services';
import { Task, TaskStatus } from 'renderer/types';

interface Params {
  task: Task;
  stakingAccountPublicKey: string;
}

export const useTaskStatus = ({ task, stakingAccountPublicKey }: Params) => {
  const {
    data: taskStatus = TaskStatus.PRE_SUBMISSION,
    isLoading: isLoadingStatus,
    error,
  } = useQuery(
    [QueryKeys.TaskStatus, task],
    () => TaskService.getStatus(task, stakingAccountPublicKey),
    {
      enabled: !!stakingAccountPublicKey,
    }
  );

  return {
    taskStatus,
    isLoadingStatus,
    statusError: error,
  };
};
