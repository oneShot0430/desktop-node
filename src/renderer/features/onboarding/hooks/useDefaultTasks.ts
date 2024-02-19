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
    [QueryKeys.OnboardingTasks],
    () =>
      getOnboardingTaskIds().then((tasksAllowedOnOnboarding) =>
        getTasksById(tasksAllowedOnOnboarding)
      ),
    {
      onError(error) {
        console.error(error);
      },
      refetchInterval: Infinity,
    }
  );

  return {
    verifiedTasks,
    isLoading,
    error,
  };
};
