import React, { memo } from 'react';

import { Table } from 'renderer/components/ui';
import { Task } from 'renderer/types';

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

export function History() {
  return (
    /**
     * @todo: update this to use the new Table when we need to re-include the History feature
     */

    <Table headers={tableHeaders} columnsLayout="grid-cols-history">
      {historyRows.map(({ publicKey, task }) => (
        <HistoryRow key={publicKey} task={task} />
      ))}
    </Table>
  );
}

export default memo(History);
