import { useQuery } from 'react-query';

import { QueryKeys, TaskService } from 'renderer/services';
import { Task, TaskStatus } from 'renderer/types';

import { usePrivateTasks } from '../../tasks';

interface Params {
  task: Task;
  stakingAccountPublicKey: string;
}

export const useTaskStatus = ({ task, stakingAccountPublicKey }: Params) => {
  const { privateTasksQuery } = usePrivateTasks();

  const lastFewRounds = Object.keys(task.submissions);
  const lastRound = lastFewRounds[lastFewRounds.length - 1];

  const {
    data: taskStatus = TaskStatus.PRE_SUBMISSION,
    isLoading: isLoadingStatus,
    error,
  } = useQuery(
    [
      QueryKeys.TaskStatus,
      task.publicKey,
      lastRound,
      task.hasError,
      task.isRunning,
    ],
    () =>
      TaskService.getStatus(
        task,
        stakingAccountPublicKey,
        !!privateTasksQuery.data?.includes(task.publicKey)
      ),
    {
      enabled: !!stakingAccountPublicKey && !privateTasksQuery.isLoading,
    }
  );

  return {
    taskStatus,
    isLoadingStatus,
    statusError: error,
  };
};
