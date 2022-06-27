import React from 'react';
import { useDispatch } from 'react-redux';

import { TaskData } from 'main/type/TaskData';
import { Button } from 'webapp/components/ui/Button';
import { Table } from 'webapp/components/ui/Table/Table';
import { showModal } from 'webapp/store/actions/modal';

import MyNodeTasksTable from './components/MyNodeTasksTable';
import MyNodeToolbar from './components/MyNodeToolbar';

const MyNode = (): JSX.Element => {
  const tableHeaders = [
    'Start/Stop',
    'TaskName & Start Time',
    'Role',
    'Creator',
    'Earned',
    'Stake',
    'Status',
    'Add/Withdraw',
  ];

  const tasks: TaskData[] = [
    {
      taskName: '',
      taskManager: '',
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
    },
  ];

  const dispatch = useDispatch();

  return (
    <div className="relative overflow-x-auto">
      <Table tableHeaders={tableHeaders}>table</Table>

      {/* <div className="mt-34.5">
        <MyNodeTasksTable />
      </div> */}
    </div>
  );
};

export default MyNode;
