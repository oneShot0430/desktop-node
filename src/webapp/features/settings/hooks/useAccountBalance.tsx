import { useQuery, QueryKey } from 'react-query';

import { getAccountBalance } from 'webapp/services';

const fetchAccountBalance = async ({
  queryKey: [, publicKey],
}: {
  queryKey: QueryKey;
}) => {
  const data = await getAccountBalance(publicKey as string);
  return data;
};

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
