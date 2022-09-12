import { useQuery } from 'react-query';

import { fetchAccountBalance } from './common';

export const useAccountBalance = (accountPublicKey: string) => {
  const {
    data: acountBalance,
    isLoading: loadingAccountBalance,
    error: acountBalanceLoadingError,
  } = useQuery(['account-balance', accountPublicKey], fetchAccountBalance);

  return {
    acountBalance,
    loadingAccountBalance,
    acountBalanceLoadingError,
  };
};
