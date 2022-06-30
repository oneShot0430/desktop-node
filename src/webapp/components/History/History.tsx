import React from 'react';

import { Task } from 'webapp/@type/task';

import { Table } from '../ui/Table';

import { HistoryRow } from './components/HistoryRow';

const historyRows = [] as any;

const tableHeaders = [
  'TaskName & Start Time',
  'Task Type',
  'Status',
  'Nodes',
  'Top Stake',
  'Set Stake',
];

export const History = () => {
  return (
    <Table tableHeaders={tableHeaders}>
      {historyRows.map(({ publicKey, task }: { publicKey: any; task: any }) => (
        <HistoryRow key={publicKey} task={task} />
      ))}
    </Table>
  );
};
