import React from 'react';

import { Task } from 'webapp/@type/task';
import { MyNodeTable } from 'webapp/components/MyNodeTable/MyNodeTable';

const MyNode = (): JSX.Element => {
  const tasks: Task[] = [
    {
      taskName: 'Name',
      taskManager: 'Creator name',
      isWhitelisted: true,
      isActive: true,
      taskAuditProgram: '',
      stakePotAccount: '',
      totalBountyAmount: 0,
      bountyAmountPerRound: 0,
      status: null,
      currentRound: 0,
      availableBalances: null,
      stakeList: null,
      isRunning: true,
      cronArray: null,
      publicKey: 'sjisdhjsd',
    },
  ];

  // const dispatch = useDispatch();

  return (
    <div className="relative overflow-x-auto">
      <MyNodeTable tasks={tasks} />

      {/* <div>
        <MyNodeTasksTable />
      </div> */}
    </div>
  );
};

export default MyNode;
