import { useQuery, QueryFunctionContext } from 'react-query';

import { getAccountBalance } from 'webapp/services';

const fetchAccountBalance = async ({
  queryKey: [, publicKey],
}: QueryFunctionContext<string[]>) => getAccountBalance(publicKey);

export const useAccountBalance = (accountPublicKey: string) => {
  const {
    data: accountBalance,
    isLoading: loadingAccountBalance,
    error: acountBalanceLoadingError,
  } = useQuery(['account-balance', accountPublicKey], fetchAccountBalance);

  return {
    accountBalance,
    loadingAccountBalance,
    acountBalanceLoadingError,
  };
};
