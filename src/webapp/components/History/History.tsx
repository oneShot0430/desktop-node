import React, { memo } from 'react';

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
      {historyRows.map(
        ({ publicKey, task }: { publicKey: string; task: Task }) => (
          <HistoryRow key={publicKey} task={task} />
        )
      )}
    </Table>
  );
};

export default memo(History);
