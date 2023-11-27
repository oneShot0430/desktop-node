import { TaskData } from 'models';

export const getTaskTotalStake = (task: TaskData) => {
  return (
    Object.values(task.stakeList).reduce((acc, value) => acc + value, 0) || 0
  );
};
