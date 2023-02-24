import { useQuery } from 'react-query';

import { PairedTaskVariables } from 'models';
import { QueryKeys, getStoredPairedTaskVariables } from 'webapp/services';

type UseStoredPairedTaskVariablesParams = {
  enabled?: boolean;
};

export const useAllStoredPairedTaskVariables = (
  options?: UseStoredPairedTaskVariablesParams
) => {
  const storedPairedTaskVariablesQuery = useQuery<PairedTaskVariables>(
    [QueryKeys.StoredPairedTaskVariables],
    getStoredPairedTaskVariables,
    options
  );

  return { storedPairedTaskVariablesQuery };
};
