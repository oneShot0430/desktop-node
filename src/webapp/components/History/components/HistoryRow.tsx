import React from 'react';
import { useQuery } from 'react-query';

import { useTaskDetailsModal } from 'webapp/components/MyNodeTable/hooks';
import {
  TableRow,
  TableCell,
  NodeStatusCell,
} from 'webapp/components/ui/Table';
import { TaskDetailsCell } from 'webapp/components/ui/Table/TaskDetailsCell';
import { useTaskStake } from 'webapp/features/common';
import {
  getMainAccountPublicKey,
  QueryKeys,
  TaskService,
} from 'webapp/services';
import { Task } from 'webapp/types';

export const HistoryRow = ({ task }: { task: Task }) => {
  /**
   * @todo: abstract it away to the hook
   */
  const { data: mainAccountPubKey, isLoading: loadingMainAccount } = useQuery(
    QueryKeys.MainAccount,
    () => getMainAccountPublicKey()
  );
  const { taskStake } = useTaskStake({ task, publicKey: mainAccountPubKey });
  const { taskName, publicKey } = task;

  const nodes = TaskService.getNodesCount(task);
  const topStake = TaskService.getTopStake(task);

  const nodeStatus = TaskService.getStatus(task);

  const { showModal } = useTaskDetailsModal({
    task,
    accountPublicKey: mainAccountPubKey,
  });

  if (loadingMainAccount) return null;

  return (
    <TableRow key={publicKey}>
      <TaskDetailsCell
        taskName={taskName}
        createdAt={'DATE STRING'}
        onClick={showModal}
      />
      <TableCell>{'TBD'}</TableCell>
      <NodeStatusCell status={nodeStatus} />
      <TableCell>{nodes}</TableCell>
      <TableCell>{topStake}</TableCell>
      <TableCell>{taskStake}</TableCell>
    </TableRow>
  );
};
