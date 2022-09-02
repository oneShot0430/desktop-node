import { useCallback } from 'react';
import { useQuery } from 'react-query';

import { getAccountBalance } from 'webapp/services';

export const useAccountBalance = (accountPublicKey: string) => {
  const fetchAccountBalance = useCallback(
    () => getAccountBalance(accountPublicKey),
    [accountPublicKey]
  );

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
