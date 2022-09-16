import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';

import { useDefaultTasks } from 'webapp/features/onboarding/hooks';
import { AppRoute } from 'webapp/routing/AppRoutes';
import { stakeOnTask, startTask } from 'webapp/services';

import { useTasksSelect } from './useTasksSelect';
import { useTaskStakeInputLogic } from './useTaskStakeInputLogic';

export const useRunFirstTasksLogic = () => {
  const {
    verifiedTasks,
    isLoading: loadingVerifiedTasks,
    error: verifiedTasksFetchError,
  } = useDefaultTasks();
  const { stakePerTask, totalStaked, handleStakeInputChange, setStakePerTask } =
    useTaskStakeInputLogic();
  const { selectedTasks, setFilteredTasksByKey, handleTaskRemove } =
    useTasksSelect({
      verifiedTasks,
    });

  const navigate = useNavigate();

  const handleRunTasks = async () => {
    const stakeOnTasksPromises = Object.entries(stakePerTask).map(
      ([taskPubKey, stake]) => stakeOnTask(taskPubKey, stake)
    );

    /**
     * @dev staking in each individua task before we continue
     */
    await Promise.all(stakeOnTasksPromises);
    const promises = selectedTasks.map(({ publicKey }) => startTask(publicKey));
    await Promise.all(promises);
  };

  const handleRestoreTasks = async () => {
    setStakePerTask({});
    setFilteredTasksByKey([]);
  };

  const {
    mutate: runTasks,
    isLoading: runTasksLoading,
    error: runTasksError,
  } = useMutation(handleRunTasks, {
    onSuccess: () => {
      navigate(AppRoute.OnboardingConfirmStake);
    },
  });

  return {
    selectedTasks,
    loadingVerifiedTasks,
    verifiedTasksFetchError,
    totalStaked,
    stakePerTask,

    runTasks,
    runTasksLoading,
    runTasksError,

    handleRestoreTasks,
    handleTaskRemove,
    handleStakeInputChange,
  };
};
