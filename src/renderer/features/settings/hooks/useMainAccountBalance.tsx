import { useQuery } from 'react-query';

import { QueryKeys } from 'renderer/services';

import { fetchAccountBalance } from './common';
import { useMainAccount } from './useMainAccount';

export const useMainAccountBalance = () => {
  const { data: mainAccountPublicKey } = useMainAccount();
  const {
    data: accountBalance,
    isLoading: loadingAccountBalance,
    error: accountBalanceLoadingError,
  } = useQuery(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    [QueryKeys.AccountBalance, mainAccountPublicKey!],

    fetchAccountBalance,
    {
      enabled: !!mainAccountPublicKey,
    }
  );

  return {
    accountBalance,
    loadingAccountBalance,
    accountBalanceLoadingError,
  };
};
