import { useQuery } from 'react-query';

import { getAllAccounts } from 'webapp/services';

export const useAccounts = () => {
  const {
    data: accounts,
    isLoading,
    error,
  } = useQuery(['accounts'], getAllAccounts);

  return { accounts, loadingAccounts: isLoading, errorAccounts: error };
};
