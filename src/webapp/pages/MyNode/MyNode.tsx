import React from 'react';
import { useQuery } from 'react-query';

import { MyNodeTable } from 'webapp/components/MyNodeTable/MyNodeTable';
import { fetchTasks } from 'webapp/services/api';

const MyNode = (): JSX.Element => {
  const { isLoading, data: tasks, error } = useQuery('tasks', fetchTasks);

  const tasksMock = [
    {
      publicKey: 'CnPVv3ptH7B28eYetVVQF5CBdbSwpiNsmraDjcoNpfoU',
      taskName: 'test',
      taskManager: 'BMfzW8e1rftddiWCmmunMbFusS3Ecc3M6mZKvAW98vRf',
      isWhitelisted: false,
      isActive: true,
      taskAuditProgram: 'ywK1Wmilq2Z3Ykwqa0QWNvkyTOgPRSOTpp-u9Y1QNLA',
      stakePotAccount: 'HPoJ9Mhwm29F3RrzNWE8utXBi7jVPUKMpVYZs9a2mVm5',
      totalBountyAmount: 20000000000,
      bountyAmountPerRound: 5000000000,
      status: {
        AcceptingSubmissions: 100000,
      },
      currentRound: 0,
      availableBalances: {},
      stakeList: {},
      isRunning: false,
      cronArray: [''],
    },
  ];

  return (
    <div className="relative overflow-x-auto">
      <MyNodeTable
        tasks={tasksMock}
        isLoading={isLoading}
        error={error as string}
      />

      {/* <div>
        <MyNodeTasksTable />
      </div> */}
    </div>
  );
};

export default MyNode;
