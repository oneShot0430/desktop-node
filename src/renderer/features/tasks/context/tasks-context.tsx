import { CloseLine } from '@_koii/koii-styleguide';
import React, { createContext, useMemo } from 'react';
import toast from 'react-hot-toast';
import { UseMutationResult, useMutation, useQueryClient } from 'react-query';

import { QueryKeys, stakeOnTask, startTask } from 'renderer/services';

interface TasksContext {
  startTaskMutation: UseMutationResult<
    void,
    unknown,
    StartTaskMutationArgs,
    unknown
  >;
  startTaskSucceeded: boolean;
}

const Ctx = createContext<TasksContext | undefined>(undefined);

type PropsType = {
  children: React.ReactNode;
};

type StartTaskMutationArgs = {
  publicKey: string;
  valueToStake: number;
  alreadyStakedTokensAmount: number;
};

export function TasksProvider({ children }: PropsType) {
  const queryClient = useQueryClient();
  const [startTaskSucceeded, setStartTaskSucceeded] = React.useState(false);

  const startTaskMutation = useMutation(
    async ({
      publicKey,
      valueToStake,
      alreadyStakedTokensAmount,
    }: StartTaskMutationArgs) => {
      if (alreadyStakedTokensAmount === 0) {
        await stakeOnTask(publicKey, valueToStake);
      }
      await startTask(publicKey);
    },
    {
      onSuccess: () => setStartTaskSucceeded(true),
      onSettled: () => queryClient.invalidateQueries([QueryKeys.taskNodeInfo]),
      onError: (error) => {
        console.error(error);
        toast.error('Task running failed. Please try again!', {
          duration: 1500,
          icon: <CloseLine className="h-5 w-5" />,
          style: {
            backgroundColor: '#FFA6A6',
            paddingRight: 0,
          },
        });
      },
    }
  );

  const value = useMemo(
    () => ({ startTaskMutation, startTaskSucceeded }),
    [startTaskMutation, startTaskSucceeded]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useTasksContext() {
  const context = React.useContext(Ctx);
  if (!context) {
    throw new Error('useTasksContext must be used inside TasksProvider');
  }
  return context;
}
