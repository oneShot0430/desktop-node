import React, { memo } from 'react';

import { Task } from 'webapp/types';

import { Table } from '../ui/Table';

import { HistoryRow } from './components/HistoryRow';

const historyRows = [] as { publicKey: string; task: Task }[];

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
      {historyRows.map(({ publicKey, task }) => (
        <HistoryRow key={publicKey} task={task} />
      ))}
    </Table>
  );
};

export default memo(History);
