import React, { memo } from 'react';

import { Table } from 'webapp/components/ui/Table';
import { Task } from 'webapp/types';

import AvailableTaskRow from './AvailableTaskRow';

type PropsType = {
  tasks: Task[];
  isLoading?: boolean;
  error?: string;
};

const tableHeaders = [
  'Code',
  'TaskName ',
  'Creator',
  'Bounty',
  'Nodes',
  'Top Stake',
  'Set Stake',
  'Run Task',
];

const AvailableTasksTable = ({ tasks = [], isLoading, error }: PropsType) => {
  return (
    <Table tableHeaders={tableHeaders} isLoading={isLoading} error={error}>
      {tasks.map((task) => (
        <AvailableTaskRow key={task.publicKey} task={task} />
      ))}
    </Table>
  );
};

export default memo(AvailableTasksTable);
