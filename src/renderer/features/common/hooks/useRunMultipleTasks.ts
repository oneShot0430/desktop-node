import { useMutation } from 'react-query';

import { stakeOnTask, startTask } from 'renderer/services';
import { TaskWithStake } from 'renderer/types';
import { getErrorToDisplay } from 'renderer/utils';

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
            const errorLog = getErrorToDisplay(error);
            const errorMessage = `Task ${publicKey} can't be deployed because of error: ${errorLog}`;
            console.error(errorMessage);
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
  } = useMutation<void, string[]>(handleRunTasks, {
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
