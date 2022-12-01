import React, { memo } from 'react';

import { Task } from 'webapp/types';

import { Table } from '../ui/Table';

import { HistoryRow } from './components/HistoryRow';

const historyRows = [] as { publicKey: string; task: Task }[];

const tableHeaders = [
  { title: 'TaskName & Start Time' },
  { title: 'Task Type' },
  { title: 'Status' },
  { title: 'Nodes' },
  { title: 'Top Stake' },
  { title: 'Set Stake' },
];

export const History = () => {
  return (
    <Table tableHeaders={tableHeaders}>
      {historyRows.map(({ publicKey, task }) => (
        <HistoryRow key={publicKey} task={task} />
      ))}
    </Table>
  );
};

export default memo(History);
