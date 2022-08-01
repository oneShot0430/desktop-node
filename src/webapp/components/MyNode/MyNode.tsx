import React from 'react';
import { useQuery } from 'react-query';

import { MyNodeTable } from 'webapp/components/MyNodeTable/MyNodeTable';
import { QueryKeys, fetchMyTasks } from 'webapp/services';
import { Task } from 'webapp/types/task';

const MyNode = (): JSX.Element => {
  const {
    isLoading,
    data: tasks,
    error,
  } = useQuery([QueryKeys.taskList], fetchMyTasks);

  const tasksMock: Task[] = new Array(10).fill({
    taskName: 'example task',
    taskManager: 'task manager',
    isWhitelisted: true,
    isActive: true,
    taskAuditProgram: '',
    stakePotAccount: '',
    totalBountyAmount: 0,
    bountyAmountPerRound: 0,
    status: {},
    currentRound: 0,
    availableBalances: {},
    stakeList: {},
    isRunning: true,
    cronArray: [],
    publicKey: '',
  });

  return (
    <div className="relative overflow-x-auto">
      <MyNodeTable
        tasks={tasksMock}
        isLoading={isLoading}
        error={error as string}
      />
    </div>
  );
};

export default MyNode;
