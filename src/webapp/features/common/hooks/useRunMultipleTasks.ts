import { useMutation } from 'react-query';

import { stakeOnTask, startTask } from 'webapp/services';
import { TaskWithStake } from 'webapp/types';

type UseRunMultipleTasksParams = {
  tasksToRun: TaskWithStake[];
  onRunAllTasksSuccessCallback?: () => void;
};

export const useRunMultipleTasks = ({
  tasksToRun,
  onRunAllTasksSuccessCallback,
}: UseRunMultipleTasksParams) => {
  const handleRunTasks = async () => {
    const stakeOnTasksPromises = tasksToRun
      /**
       * @dev do not inlcude staking action promise if there is no stake
       */
      .filter(({ stake }) => stake > 0)
      .map(({ stake, publicKey }) => stakeOnTask(publicKey, stake));

    /**
     * @dev staking in each individual task before we continue
     */
    await Promise.all(stakeOnTasksPromises);
    const promises = tasksToRun.map(({ publicKey }) => startTask(publicKey));
    await Promise.all(promises);
  };

  const {
    mutate: runAllTasks,
    isLoading: runTasksLoading,
    error: runTasksError,
  } = useMutation(handleRunTasks, {
    onSuccess: () => {
      if (onRunAllTasksSuccessCallback) {
        onRunAllTasksSuccessCallback();
      }
    },
  });

  return {
    runAllTasks,
    runTasksError,
    runTasksLoading,
  };
};
