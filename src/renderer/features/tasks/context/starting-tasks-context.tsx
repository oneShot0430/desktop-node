import React, { createContext, useCallback, useMemo, useState } from 'react';

import { stakeOnTask, startTask } from 'renderer/services';

type StartTaskArgs = {
  publicKey: string;
  valueToStake: number;
  alreadyStakedTokensAmount: number;
};

interface TasksContext {
  executeTask: (args: StartTaskArgs) => Promise<void>;
  getIsTaskLoading: (publicKey: string) => boolean;
  getTaskStartPromise: (publicKey: string) => ReturnType<typeof runTask>;
}

const Ctx = createContext<TasksContext | undefined>(undefined);

type PropsType = {
  children: React.ReactNode;
};

const runTask = async ({
  publicKey,
  alreadyStakedTokensAmount,
  valueToStake,
}: StartTaskArgs) => {
  if (alreadyStakedTokensAmount === 0) {
    await stakeOnTask(publicKey, valueToStake);
  }
  await startTask(publicKey);
};

type TaskStartingPromise = ReturnType<typeof runTask>;

export function StartingTasksProvider({ children }: PropsType) {
  const [startTaskPromises, setStartTaskPromises] = useState<
    Record<string, TaskStartingPromise>
  >({});

  const executeTask = useCallback(
    async (args: StartTaskArgs) => {
      const { publicKey } = args;
      const taskPromise = runTask(args).finally(() => {
        // delete promise when it's done
        const { [publicKey]: removedKey, ...remainingPromises } =
          startTaskPromises;
        setStartTaskPromises(remainingPromises);
      });

      setStartTaskPromises({
        ...startTaskPromises,
        [publicKey]: taskPromise,
      });
    },
    [startTaskPromises]
  );

  const getTaskStartPromise = useCallback(
    (publicKey: string) => {
      return startTaskPromises[publicKey];
    },
    [startTaskPromises]
  );

  const getIsTaskLoading = useCallback(
    (publicKey: string) => {
      return !!startTaskPromises[publicKey];
    },
    [startTaskPromises]
  );

  const value = useMemo(
    () => ({
      executeTask,
      getIsTaskLoading,
      getTaskStartPromise,
    }),
    [executeTask, getIsTaskLoading, getTaskStartPromise]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStartingTasksContext() {
  const context = React.useContext(Ctx);
  if (!context) {
    throw new Error(
      'useStartingTasksContext must be used inside StartingTasksProvider'
    );
  }
  return context;
}
