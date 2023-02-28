import { useQuery } from 'react-query';

import { getRewardEarned, QueryKeys } from 'renderer/services';
import { Task } from 'renderer/types';

type ParamsType = {
  task: Task;
  publicKey: string;
};

export const useEarnedReward = ({ task, publicKey }: ParamsType) => {
  const { data: earnedReward = 0 } = useQuery(
    [QueryKeys.taskReward, task.publicKey, publicKey],
    () => getRewardEarned(task)
  );

  return { earnedReward };
};
