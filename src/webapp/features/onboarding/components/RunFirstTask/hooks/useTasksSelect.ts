import { useMemo, useState } from 'react';

import { Task } from 'webapp/types';

type ParamsType = {
  verifiedTasks: Task[];
};

export const useTasksSelect = ({ verifiedTasks = [] }: ParamsType) => {
  const [filteredTasksByKey, setFilteredTasksByKey] = useState<string[]>([]);

  const handleTaskRemove = (taskPubKey: string) => {
    const filteredKeys = [...filteredTasksByKey, taskPubKey];
    console.log('@@@filteredKeys', filteredKeys);
    setFilteredTasksByKey(filteredKeys);
  };

  const selectedTasks = useMemo(
    () =>
      verifiedTasks.filter((task) => {
        const shouldFilter = !filteredTasksByKey.includes(task.publicKey);
        return shouldFilter;
      }),
    [filteredTasksByKey, verifiedTasks]
  );

  return {
    setFilteredTasksByKey,
    handleTaskRemove,
    selectedTasks,
  };
};
