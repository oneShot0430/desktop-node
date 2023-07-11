import { useQuery } from 'react-query';

import { QueryKeys, getStartedTasksPubKeys } from 'renderer/services';

export const useStartedTasksPubKeys = () => {
  const startedTasksPubkeysQuery = useQuery(
    [QueryKeys.StartedTasksPubKeys],
    getStartedTasksPubKeys
  );

  return startedTasksPubkeysQuery;
};
