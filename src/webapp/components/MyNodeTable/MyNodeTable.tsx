import React from 'react';

import { Task } from 'webapp/@type/task';

import { Table } from '../ui/Table';

import { TaskRow } from './components/TaskRow';

type PropsType = {
  tasks: Task[];
  isLoading?: boolean;
  error?: string;
};

const tableHeaders = [
  'Start/Stop',
  'TaskName & Start Time',
  'Creator',
  'Earned',
  'Stake',
  'Status',
  'Add/Withdraw',
];

export const MyNodeTable = ({ tasks = [], isLoading, error }: PropsType) => {
  return (
    <Table tableHeaders={tableHeaders} isLoading={isLoading} error={error}>
      {tasks.map((task) => (
        <TaskRow key={task.publicKey} task={task} />
      ))}
    </Table>
  );
};
