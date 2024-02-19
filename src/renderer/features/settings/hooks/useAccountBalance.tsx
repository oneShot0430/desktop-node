import { useQuery } from 'react-query';

import {
  ACCOUNT_BALANCE_DATA_DEFAULT_STALE_TIME,
  ACCOUNT_BALANCE_DATA_REFETCH_INTERVAL,
} from 'config/refetchIntervals';
import { getAccountBalance, QueryKeys } from 'renderer/services';

export const useAccountBalance = (accountPublicKey?: string) => {
  const {
    data: accountBalance,
    isLoading: loadingAccountBalance,
    error: accountBalanceLoadingError,
  } = useQuery(
    accountPublicKey ? [QueryKeys.AccountBalance, accountPublicKey] : [],
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    () => getAccountBalance(accountPublicKey!),
    {
      enabled: !!accountPublicKey,
      staleTime: ACCOUNT_BALANCE_DATA_DEFAULT_STALE_TIME,
      refetchInterval: ACCOUNT_BALANCE_DATA_REFETCH_INTERVAL,
    }
  );

  return {
    accountBalance,
    loadingAccountBalance,
    accountBalanceLoadingError,
  };
};
