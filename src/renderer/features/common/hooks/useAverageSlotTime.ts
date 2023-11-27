import { useQuery } from 'react-query';

import { getAverageSlotTime, QueryKeys } from 'renderer/services';

export const useAverageSlotTime = () => {
  return useQuery([QueryKeys.AverageSlotTime], getAverageSlotTime, {
    // 30min retry
    retry: 30 * 60 * 1000,
  });
};
