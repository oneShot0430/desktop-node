import { useQuery } from 'react-query';

import { getRewardEarned, QueryKeys } from 'webapp/services';
import { Task } from 'webapp/types';

type ParamsType = {
  task: Task;
  publicKey: string;
};

export const useEarnedReward = ({ task, publicKey }: ParamsType) => {
  const { data: earnedReward } = useQuery(
    [QueryKeys.taskReward, task.publicKey, publicKey],
    () => getRewardEarned(task)
  );

  return { earnedReward };
};
