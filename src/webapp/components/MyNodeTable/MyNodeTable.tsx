import React from 'react';

import { Task } from 'webapp/@type/task';

import { Table } from '../ui/Table';

import { TaskRow } from './components/TaskRow';

type PropsType = {
  tasks: Task[];
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

export const MyNodeTable = ({ tasks }: PropsType) => {
  return (
    <Table tableHeaders={tableHeaders}>
      {tasks.map((task) => (
        <TaskRow key={task.publicKey} task={task} />
      ))}
    </Table>
  );
};
