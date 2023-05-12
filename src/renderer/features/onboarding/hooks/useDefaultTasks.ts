import { useQuery } from 'react-query';

import { QueryKeys, getTasksById } from 'renderer/services';

const tasksAllowedOnOnboarding = [
  'HFvWYY9tLFKWEmKsAExofWfxWxEEix7ezBjzz2JdsrwA',
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
