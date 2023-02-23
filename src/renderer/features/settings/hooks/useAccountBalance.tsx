import { useQuery } from 'react-query';

import { fetchAccountBalance } from './common';

export const useAccountBalance = (accountPublicKey: string) => {
  const {
    data: accountBalance,
    isLoading: loadingAccountBalance,
    error: accountBalanceLoadingError,
  } = useQuery(['account-balance', accountPublicKey], fetchAccountBalance);

  return {
    accountBalance,
    loadingAccountBalance,
    accountBalanceLoadingError,
  };
};
