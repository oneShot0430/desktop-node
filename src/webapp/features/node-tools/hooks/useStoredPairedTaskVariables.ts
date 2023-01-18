import { useQuery } from 'react-query';

import { QueryKeys, getStoredPairedTaskVariables } from 'webapp/services';

export const useStoredPairedTaskVariables = () => {
  const storedPairedTaskVariablesQuery = useQuery(
    [QueryKeys.StoredPairedTaskVariables],
    getStoredPairedTaskVariables
  );

  return { storedPairedTaskVariablesQuery };
};
