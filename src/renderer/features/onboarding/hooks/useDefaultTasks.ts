import { useQuery } from 'react-query';

import { QueryKeys, getTasksById } from 'renderer/services';

const tasksAllowedOnOnboarding = [
  'DSc7PmaDG1ubwEm1CaQVGVo6jRBVtMZKgyBa89R5k1k9',
];

export const useDefaultTasks = () => {
  const {
    isLoading,
    error,
    data: verifiedTasks = [],
  } = useQuery(
    [
      QueryKeys.taskList,
      {
        tasksIds: tasksAllowedOnOnboarding,
      },
    ],
    () => getTasksById(tasksAllowedOnOnboarding)
  );

  return {
    verifiedTasks,
    isLoading,
    error,
  };
};
