import { useQuery } from 'react-query';

import { QueryKeys, getTaskVariablesNames } from 'webapp/services';

type UseTaskVariablesParams = {
  taskPubKey: string;
};

export const useTaskVariablesNames = ({
  taskPubKey,
}: UseTaskVariablesParams) => {
  const taskVariablesNamesQuery = useQuery(
    [QueryKeys.TaskVariablesNames, taskPubKey],
    () => getTaskVariablesNames(taskPubKey),
    {
      enabled: !!taskPubKey,
    }
  );

  return { taskVariablesNamesQuery };
};
