import { useQuery } from 'react-query';

import {
  QueryKeys,
  getTasksById,
  getOnboardingTaskIds,
} from 'renderer/services';

export const useDefaultTasks = () => {
  const {
    isLoading,
    error,
    data: verifiedTasks = [],
  } = useQuery(
    [QueryKeys.taskList],
    () =>
      getOnboardingTaskIds().then((tasksAllowedOnOnboarding) =>
        getTasksById(tasksAllowedOnOnboarding)
      ),
    {
      refetchInterval: Infinity,
    }
  );

  return {
    verifiedTasks,
    isLoading,
    error,
  };
};
