import { useQuery } from 'react-query';

import { fetchAccountBalance } from './common';

export const useAccountBalance = (accountPublicKey?: string) => {
  const {
    data: accountBalance,
    isLoading: loadingAccountBalance,
    error: accountBalanceLoadingError,
  } = useQuery(
    accountPublicKey ? ['account-balance', accountPublicKey] : [],
    fetchAccountBalance,
    {
      enabled: !!accountPublicKey,
    }
  );

  return {
    accountBalance,
    loadingAccountBalance,
    accountBalanceLoadingError,
  };
};
