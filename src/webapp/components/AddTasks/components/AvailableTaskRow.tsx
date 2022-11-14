import React, { memo, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from 'react-query';

import CodeIcon from 'assets/svgs/code-icon-lg.svg';
import PlayIcon from 'assets/svgs/play-icon.svg';
import StopTealIcon from 'assets/svgs/stop-icon-teal.svg';
import { getKoiiFromRoe } from 'utils';
import { Button, LoadingSpinner, LoadingSpinnerSize } from 'webapp/components';
import { useTaskDetailsModal } from 'webapp/components/MyNodeTable/hooks';
import { TableRow, TableCell } from 'webapp/components/ui/Table';
import { EditStakeInput } from 'webapp/features/onboarding/components/EditStakeInput';
import {
  QueryKeys,
  startTask,
  TaskService,
  stopTask,
  getMainAccountPublicKey,
  stakeOnTask,
} from 'webapp/services';
import { Task } from 'webapp/types';

const AvailableTaskRow = ({ task }: { task: Task }) => {
  /**
   * @todo: abstract it away to the hook
   */
  const { data: mainAccountPubKey, isLoading: loadingMainAccount } = useQuery(
    QueryKeys.MainAccount,
    () => getMainAccountPublicKey()
  );

  const { showModal } = useTaskDetailsModal({
    task,
    accountPublicKey: mainAccountPubKey,
  });

  const [stake, setStake] = useState<number>(0);
  const [meetsMinimumStake, setMeetsMinimumStake] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const queryCache = useQueryClient();
  const { taskName, publicKey, bountyAmountPerRound, taskManager, isRunning } =
    task;
  const nodes = TaskService.getNodesCount(task);
  const topStake = TaskService.getTopStake(task);

  const bountyPerRoundInKoii = getKoiiFromRoe(bountyAmountPerRound);

  const { data: myStake, isLoading: isLoadingStake } = useQuery(
    [QueryKeys.myStake, publicKey],
    () => TaskService.getMyStake(task)
  );

  const { data: minStake } = useQuery([QueryKeys.minStake, publicKey], () =>
    TaskService.getMinStake(task)
  );

  const myStakeInKoii = getKoiiFromRoe(myStake);
  const defaultStakeValue = isLoadingStake
    ? 0
    : Number(TaskService.formatStake(myStakeInKoii));

  // Use defaultStakeValue by default, but later we continue displaying stake while we modify it
  useEffect(() => {
    setStake(defaultStakeValue);
    setMeetsMinimumStake(defaultStakeValue >= minStake);
  }, [defaultStakeValue, minStake]);

  const handleStartTask = async () => {
    try {
      setLoading(true);
      await stakeOnTask(publicKey, getKoiiFromRoe(stake));
      await startTask(publicKey);
    } catch (error) {
      console.warn(error);
    } finally {
      queryCache.invalidateQueries();
      setLoading(false);
    }
  };

  const handleStopTask = async () => {
    try {
      await stopTask(publicKey);
    } catch (error) {
      console.warn(error);
    } finally {
      queryCache.invalidateQueries();
    }
  };

  const handleStakeValueChange = (value: number) => {
    setStake(value);
    setMeetsMinimumStake(value >= minStake);
  };

  const handleShowCode = () => {
    showModal();
  };

  if (loadingMainAccount) return null;

  return (
    <TableRow key={publicKey}>
      <TableCell>
        <div className="flex flex-col items-center justify-start w-[40px]">
          <Button icon={<CodeIcon />} onlyIcon onClick={handleShowCode} />
          <div className="text-[6px]">INSPECT</div>
        </div>
      </TableCell>
      <TableCell>
        <div className="text-xs">
          <div>{taskName ?? ''}</div>
          <div className="text-finnieTeal">{'datestring'}</div>
        </div>
      </TableCell>

      <TableCell>
        <span title={taskManager}>{`${taskManager.substring(0, 6)}...`}</span>
      </TableCell>
      <TableCell>{bountyPerRoundInKoii}</TableCell>
      <TableCell>{nodes}</TableCell>
      <TableCell>{getKoiiFromRoe(topStake || 0)}</TableCell>
      <TableCell>
        <EditStakeInput
          meetsMinimumStake={meetsMinimumStake}
          stake={stake}
          minStake={minStake}
          onChange={handleStakeValueChange}
        />
      </TableCell>
      <TableCell>
        {loading ? (
          <div className="pl-2">
            <LoadingSpinner size={LoadingSpinnerSize.Large} />
          </div>
        ) : (
          <Button
            onlyIcon
            icon={isRunning ? <StopTealIcon /> : <PlayIcon />}
            title={isRunning ? 'Stop' : 'Start'}
            onClick={isRunning ? handleStopTask : handleStartTask}
            disabled={!meetsMinimumStake}
          />
        )}
      </TableCell>
    </TableRow>
  );
};

export default memo(AvailableTaskRow);
