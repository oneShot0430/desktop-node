import { useMemo } from 'react';
import { useQuery } from 'react-query';

import { TaskData } from 'models';
import { useAverageSlotTime } from 'renderer/features/common';
import { getLastSubmissionTime, QueryKeys } from 'renderer/services';

import { formatMilliseconds } from '../utils/utils';

export const useTaskLastSubmission = (
  task: TaskData,
  stakingAccountPublicKey: string,
  taskPublicKey: string
) => {
  const { data: averageSlotTime } = useAverageSlotTime();
  const { data: lastSubInMilliseconds } = useQuery(
    [QueryKeys.LastSubRoundPerTask, stakingAccountPublicKey, taskPublicKey],
    () =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      getLastSubmissionTime(task, stakingAccountPublicKey, averageSlotTime!),
    {
      enabled: !!stakingAccountPublicKey && !!averageSlotTime,
      refetchInterval: 60 * 1000,
    }
  );

  const lastSub = useMemo(
    () =>
      lastSubInMilliseconds ? formatMilliseconds(lastSubInMilliseconds) : 'N/A',
    [lastSubInMilliseconds]
  );

  return { lastSubmissionFormatted: lastSub, lastSubInMilliseconds };
};
