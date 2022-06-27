import { parseTask } from './api-utils';

export const fetchTasks = async () => {
  const tasks = await window.main.getTasks();
  return tasks.map(parseTask);
};

export const getRewardEarned = async (
  publicKey: string,
  availableBalances: Record<string, number>
) => {
  const results = await window.main.getEarnedRewardByNode({
    taskAccountPubKey: publicKey,
    available_balances: availableBalances,
  });
  return results;
};
