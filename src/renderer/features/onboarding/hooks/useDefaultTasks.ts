import { useQuery } from 'react-query';

import { QueryKeys, getTasksById } from 'renderer/services';

const defaultTasksIds = [
  'A9e5dGqvHZNdbhktNB1yYKY3NF1ick2UFEmyo5NgmJ1Y',
  '8v7MAZcikirWyupW4KuCSRnj1tWEVid84QaMoUBjswUd',
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
