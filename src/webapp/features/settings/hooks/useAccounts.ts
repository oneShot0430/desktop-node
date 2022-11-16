import { useQuery } from 'react-query';

import { getAllAccounts, QueryKeys } from 'webapp/services';

export const useAccounts = () => {
  const {
    data: accounts,
    isLoading,
    error,
  } = useQuery([QueryKeys.Accounts], getAllAccounts);

  return { accounts, loadingAccounts: isLoading, errorAccounts: error };
};
