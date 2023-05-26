import { useQuery } from 'react-query';

import { QueryKeys, getTasksById } from 'renderer/services';

const tasksAllowedOnOnboarding = [
  '4cj2aLZ7dGrsL4jm7b5bEzEKrYMoJzy8Juc2fWwLZrpW',
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
