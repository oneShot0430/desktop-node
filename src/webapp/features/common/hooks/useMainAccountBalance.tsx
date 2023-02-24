import { useQuery } from 'react-query';

import { fetchAccountBalance } from 'webapp/features/settings/hooks/common';
import { getMainAccountPublicKey } from 'webapp/services';

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
