import { useQuery } from 'react-query';

import { QueryKeys, TaskService } from 'webapp/services';
import { Task } from 'webapp/types';

type UseMyStakeParamsType = {
  task: Task;
  publicKey: string;
};

export const useMyStake = ({ task, publicKey }: UseMyStakeParamsType) => {
  const {
    data: myStake,
    isLoading,
    error,
  } = useQuery([QueryKeys.myStake, publicKey], () =>
    TaskService.getMyStake(task)
  );

  return {
    myStake,
    loadingMyStake: isLoading,
    loadingMyStakeError: error,
  };
};
