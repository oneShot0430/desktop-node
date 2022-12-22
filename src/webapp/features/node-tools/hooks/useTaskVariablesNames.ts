import { useQuery } from 'react-query';

import { QueryKeys, getTaskVariablesNames } from 'webapp/services';

type UseTaskVariablesParams = {
  taskPublicKey: string;
};

export const useTaskVariablesNames = ({
  taskPublicKey,
}: UseTaskVariablesParams) => {
  const taskVariablesNamesQuery = useQuery(
    [QueryKeys.TaskVariablesNames, taskPublicKey],
    () => getTaskVariablesNames(taskPublicKey),
    {
      enabled: !!taskPublicKey,
    }
  );

  return { taskVariablesNamesQuery };
};
