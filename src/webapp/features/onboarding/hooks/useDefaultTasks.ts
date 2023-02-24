import { useQuery } from 'react-query';

import { QueryKeys, getTasksById } from 'webapp/services';

const defaultTasksIds = ['wAB-8rzKToarHRTiOVes974ouUg_qzjc7BOoPo-jPSs'];

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
