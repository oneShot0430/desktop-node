import { TaskService } from './taskService';

export const fetchTasks = async () => {
  const tasks = await window.main.getTasks();
  return tasks.map(TaskService.parseTask);
};

export const getRewardEarned = async (
  publicKey: string,
  availableBalances: Record<string, number>
) => {
  const results = await window.main.getEarnedRewardByNode({
    available_balances: availableBalances,
  });
  return results;
};
