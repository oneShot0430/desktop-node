import { QueryFunctionContext } from 'react-query';

import { getAccountBalance } from 'renderer/services';

export const fetchAccountBalance = async ({
  queryKey: [, publicKey],
}: QueryFunctionContext<string[]>) => getAccountBalance(publicKey);
