import { useQuery } from 'react-query';

import { QueryKeys, getPairedVariablesNamesWithValues } from 'webapp/services';

type UsePairedVariablesNamesWithValuesParams = {
  taskAccountPubKey: string;
  options?: { enabled?: boolean };
};

export const useTaskPairedVariablesNamesWithValues = ({
  taskAccountPubKey,
  options,
}: UsePairedVariablesNamesWithValuesParams) => {
  const storedTaskPairedTaskVariablesQuery = useQuery(
    [QueryKeys.StoredTaskPairedTaskVariables],
    () => getPairedVariablesNamesWithValues(taskAccountPubKey),
    options
  );

  return { storedTaskPairedTaskVariablesQuery };
};
