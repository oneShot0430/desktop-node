import React from 'react';
import { useQuery } from 'react-query';

import { TableRow, Status } from 'renderer/components/ui';
import { useStakingAccount } from 'renderer/features';
import {
  useTaskStake,
  useTaskDetailsModal,
  useTaskStatus,
} from 'renderer/features/common';
import {
  getMainAccountPublicKey,
  QueryKeys,
  TaskService,
} from 'renderer/services';
import { Task } from 'renderer/types';

export function HistoryRow({ task }: { task: Task }) {
  /**
   * @todo: abstract it away to the hook
   */
  const { data: mainAccountPubKey = '', isLoading: loadingMainAccount } =
    useQuery(QueryKeys.MainAccount, () => getMainAccountPublicKey());

  const { data: stakingAccountPublicKey = '' } = useStakingAccount();

  const { taskStake } = useTaskStake({ task, publicKey: mainAccountPubKey });
  const { taskName, publicKey } = task;

  const nodes = TaskService.getNodesCount(task);
  const topStake = TaskService.getTopStake(task);

  const { taskStatus } = useTaskStatus({
    task,
    stakingAccountPublicKey,
  });

  const { showModal } = useTaskDetailsModal({
    task,
    accountPublicKey: mainAccountPubKey,
  });

  if (loadingMainAccount) return null;

  /**
   * @todo: update this to use the new Table when we need to re-include the History feature
   */

  return (
    <TableRow key={publicKey} columnsLayout="grid-cols-history">
      <div className="text-xs flex flex-col gap-1">
        <div>{taskName}</div>
        <div className="text-finnieTeal">date string</div>
      </div>
      <div>TBD</div>
      <Status status={taskStatus} />
      <div>{nodes}</div>
      <div>{topStake}</div>
      <div>{taskStake}</div>
    </TableRow>
  );
}
