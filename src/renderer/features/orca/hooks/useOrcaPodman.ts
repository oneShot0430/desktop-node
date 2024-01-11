import { useQuery } from 'react-query';

import { QueryKeys, checkOrcaPodmanExistsAndRunning } from 'renderer/services';

export const useOrcaPodman = () => {
  const {
    data,
    isLoading: loadingOrcaPodman,
    error: orcaPodmanError,
  } = useQuery(QueryKeys.OrcaPodman, checkOrcaPodmanExistsAndRunning);
  return {
    data,
    loadingOrcaPodman,
    orcaPodmanError,
  };
};
