import { useQuery } from 'react-query';

import { QueryKeys, getTasksById } from 'renderer/services';

const defaultTasksIds = ['8iaGKc2PLx7pVvyLqW378CMTEyC1t5Z2HRsXsgLXg6Kh'];

export const useDefaultTasks = () => {
  const {
    isLoading,
    error,
    data: verifiedTasks = [],
  } = useQuery(
    [
      QueryKeys.taskList,
      {
        tasksIds: defaultTasksIds,
      },
    ],
    () => getTasksById(defaultTasksIds)
  );

  console.log('###verifiedTasks', verifiedTasks);

  return {
    verifiedTasks,
    isLoading,
    error,
  };
};
