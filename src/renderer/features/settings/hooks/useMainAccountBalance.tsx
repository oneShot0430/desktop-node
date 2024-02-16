import { useQuery } from 'react-query';

import { getMainAccountBalance, QueryKeys } from 'renderer/services';

import { useMainAccount } from './useMainAccount';

type OptionsType = {
  onSuccess?: (balance: number) => void;
};

export const useMainAccountBalance = (options?: OptionsType) => {
  const { onSuccess } = options || {};
  const { data: mainAccountPublicKey } = useMainAccount();
  const mainAccountBalanceCacheKey = [
    QueryKeys.MainAccountBalance,
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    mainAccountPublicKey!,
  ];

  const {
    data: accountBalance,
    isLoading: loadingAccountBalance,
    error: accountBalanceLoadingError,
    refetch: refetchAccountBalance,
    isRefetching: isRefetchingAccountBalance,
  } = useQuery(mainAccountBalanceCacheKey, getMainAccountBalance, {
    enabled: !!mainAccountPublicKey,
    onSuccess,
  });

  return {
    accountBalance,
    loadingAccountBalance,
    accountBalanceLoadingError,
    mainAccountBalanceCacheKey,
    refetchAccountBalance,
    isRefetchingAccountBalance,
  };
};
