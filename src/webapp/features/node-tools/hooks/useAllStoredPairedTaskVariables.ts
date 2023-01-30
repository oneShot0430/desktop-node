import { useQuery } from 'react-query';

import { QueryKeys, getStoredPairedTaskVariables } from 'webapp/services';

type UseStoredPairedTaskVariablesParams = {
  enabled?: boolean;
};

export const useAllStoredPairedTaskVariables = (
  options?: UseStoredPairedTaskVariablesParams
) => {
  const storedPairedTaskVariablesQuery = useQuery(
    [QueryKeys.StoredPairedTaskVariables],
    getStoredPairedTaskVariables,
    options
  );

  return { storedPairedTaskVariablesQuery };
};
