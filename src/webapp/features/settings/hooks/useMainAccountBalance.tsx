import { useQuery } from 'react-query';

import { getMainAccountPublicKey } from 'webapp/services';

import { fetchAccountBalance } from './common';

export const useMainAccountBalance = () => {
  const { data: mainAccountPubKey } = useQuery(
    ['main-account'],
    getMainAccountPublicKey
  );

  const mainAccountBalanceQuery = useQuery(
    ['account-balance', mainAccountPubKey as string],
    fetchAccountBalance,
    {
      enabled: !!mainAccountPubKey,
    }
  );

  return mainAccountBalanceQuery;
};
