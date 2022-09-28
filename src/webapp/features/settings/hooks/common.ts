import { QueryFunctionContext } from 'react-query';

import { getAccountBalance } from 'webapp/services';

export const fetchAccountBalance = async ({
  queryKey: [, publicKey],
}: QueryFunctionContext<string[]>) => getAccountBalance(publicKey);
