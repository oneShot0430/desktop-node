import { useQuery } from 'react-query';

import { QueryKeys, getTasksById } from 'webapp/services';

const defaultTasksIds = ['5AFc85AYGpUz7XyFJEXC6sD94xZzJQ9tgch7ar1eEFQY'];

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
