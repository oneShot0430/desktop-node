import { useQuery } from 'react-query';

import { QueryKeys, getMainAccountPublicKey } from 'webapp/services';

export const useMainAccount = () => {
  return useQuery(QueryKeys.MainAccount, () => getMainAccountPublicKey());
};
