import { useQuery } from 'react-query';

import { QueryKeys, getTasksById } from 'renderer/services';

const tasksAllowedOnOnboarding = [
  '3w9yniFYvXWDfLb2wNZJY3S7vQ8nz9YNiFh4PB7oXyrw',
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

  console.log('###verifiedTasks', verifiedTasks);

  return {
    verifiedTasks,
    isLoading,
    error,
  };
};
