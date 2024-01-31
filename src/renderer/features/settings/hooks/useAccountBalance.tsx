import { useQuery } from 'react-query';

import { QueryKeys } from 'renderer/services';

import { fetchAccountBalance } from './common';

export const useAccountBalance = (accountPublicKey?: string) => {
  const {
    data: accountBalance,
    isLoading: loadingAccountBalance,
    error: accountBalanceLoadingError,
  } = useQuery(
    accountPublicKey ? [QueryKeys.AccountBalance, accountPublicKey] : [],
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
