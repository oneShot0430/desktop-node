import { useMutation } from 'react-query';

import { isDetailedError } from 'utils';
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
       * @dev do not include staking action promise if there is no stake
       */
      .filter(({ stake }) => stake > 0)
      .map(({ stake, publicKey }) =>
        stakeOnTask(publicKey, stake)
          .then(() => {
            return startTask(publicKey);
          })
          .catch((error) => {
            const errorLog: string = isDetailedError(error)
              ? error.summary
              : error.message;
            const errorMessage = `Task ${publicKey} can't be deployed because of error ${errorLog}`;
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
