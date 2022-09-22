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
    const errorMessages: string[] = [];
    const stakeOnTasksPromises = tasksToRun
      /**
       * @dev do not inlcude staking action promise if there is no stake
       */
      .filter(({ stake }) => stake > 0)
      .map(({ stake, publicKey }) =>
        stakeOnTask(publicKey, stake)
          .then(() => {
            return startTask(publicKey);
          })
          .catch((error) => {
            const errorMessage = `Task ${publicKey} can't be debloyed because of error ${error}`;
            console.log(errorMessage);
            errorMessages.push(errorMessage);
          })
      );

    await Promise.all(stakeOnTasksPromises);

    if (errorMessages.length > 0) {
      throw errorMessages;
    }
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
