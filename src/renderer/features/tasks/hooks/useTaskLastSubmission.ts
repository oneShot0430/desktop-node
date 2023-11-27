import { useMemo } from 'react';
import { useQuery } from 'react-query';

import { TaskData } from 'models';
import { getLastSubmissionTime, QueryKeys } from 'renderer/services';

import { formatMilliseconds } from '../utils/utils';

export const useTaskLastSubmission = (
  task: TaskData,
  stakingAccountPublicKey: string,
  taskPublicKey: string
) => {
  const { data: lastSubInMilliseconds } = useQuery(
    [QueryKeys.LastSubRoundPerTask, stakingAccountPublicKey, taskPublicKey],
    () => getLastSubmissionTime(task, stakingAccountPublicKey),
    {
      enabled: !!stakingAccountPublicKey,
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
