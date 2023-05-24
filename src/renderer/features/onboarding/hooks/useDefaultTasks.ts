import { useQuery } from 'react-query';

import { QueryKeys, getTasksById } from 'renderer/services';

const tasksAllowedOnOnboarding = [
  '2yGvW9wNiAXsZZEpx1hTjDuSY9tXpnicDUdtBMp8hyCU',
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
