import React, { createContext, useCallback, useMemo, useState } from 'react';
import { useQueryClient } from 'react-query';

import { useMainAccount } from 'renderer/features/settings/hooks/useMainAccount';
import {
  addTaskToScheduler,
  QueryKeys,
  stakeOnTask,
  startTask,
} from 'renderer/services';

type StartTaskArgs = {
  publicKey: string;
  valueToStake: number;
  alreadyStakedTokensAmount: number | null;
  isPrivate?: boolean;
  isUsingNetworking: boolean;
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
  alreadyStakedTokensAmount = 0,
  valueToStake,
  isPrivate = false,
  isUsingNetworking,
}: StartTaskArgs) => {
  if (alreadyStakedTokensAmount === 0) {
    await stakeOnTask(publicKey, valueToStake, isUsingNetworking);
  }
  await startTask(publicKey, isPrivate);
};

type TaskStartingPromise = ReturnType<typeof runTask>;

export function StartingTasksProvider({ children }: PropsType) {
  const [startTaskPromises, setStartTaskPromises] = useState<
    Record<string, TaskStartingPromise>
  >({});
  const { data: mainAccountPublicKey } = useMainAccount();

  const queryClient = useQueryClient();

  const executeTask = useCallback(
    async (args: StartTaskArgs) => {
      const { publicKey } = args;
      const taskPromise = runTask(args)
        .then(async () => {
          // enable scheduler by default
          await addTaskToScheduler(publicKey);
        })
        .finally(() => {
          // cleanup
          // delete promise when it's done
          const { [publicKey]: removedKey, ...remainingPromises } =
            startTaskPromises;
          setStartTaskPromises(remainingPromises);
          // revalidate scheduler tasks cache
          queryClient.invalidateQueries([QueryKeys.SchedulerTasks, publicKey]);
          queryClient.invalidateQueries([
            QueryKeys.MainAccountBalance,
            mainAccountPublicKey,
          ]);
        });

      setStartTaskPromises({
        ...startTaskPromises,
        [publicKey]: taskPromise,
      });
    },
    [mainAccountPublicKey, queryClient, startTaskPromises]
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
