import { useQuery } from 'react-query';

import { PairedTaskVariables } from 'models';
import { QueryKeys, getStoredPairedTaskVariables } from 'renderer/services';

type UseStoredPairedTaskVariablesParams = {
  enabled?: boolean;
};

export const useAllStoredPairedTaskVariables = (
  options?: UseStoredPairedTaskVariablesParams
) => {
  // TODO rename to AllStoredPairedTaskVariables, check occurrences of StoredTaskPairedTaskVariables and cleanup
  const storedPairedTaskVariablesQuery = useQuery<PairedTaskVariables>(
    [QueryKeys.StoredPairedTaskVariables],
    getStoredPairedTaskVariables,
    options
  );

  return { storedPairedTaskVariablesQuery };
};
