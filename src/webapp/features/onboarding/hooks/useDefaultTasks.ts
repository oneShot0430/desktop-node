import { useQuery } from 'react-query';

import { QueryKeys, getTasksById } from 'webapp/services';

const defaultTasksIds = ['7mjiYZJvjmtDXF1TAnV5Cy1rLgXcQMqEpeYJYwEhrRyt'];

export const useDefaultTasks = () => {
  const {
    isLoading,
    error,
    data: defaultTasks = [],
  } = useQuery(
    [
      QueryKeys.taskList,
      {
        tasksIds: defaultTasksIds,
      },
    ],
    () => getTasksById(defaultTasksIds)
  );

  return {
    defaultTasks,
    isLoading,
    error,
  };
};
