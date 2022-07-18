import React, { memo, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';

import CodeIcon from 'assets/svgs/code-icon-lg.svg';
import PlayIcon from 'assets/svgs/play-icon.svg';
import StopTealIcon from 'assets/svgs/stop-icon-teal.svg';
import { Button } from 'webapp/components';
import { TableRow, TableCell } from 'webapp/components/ui/Table';
import { QueryKeys, startTask, TaskService, stopTask } from 'webapp/services';
import { showModal } from 'webapp/store/actions/modal';
import { Task } from 'webapp/types';

import SetStakeCell from './SetStakeCell';

const AvailableTaskRow = ({ task }: { task: Task }) => {
  const [stake, setStake] = useState('');
  const dispatch = useDispatch();
  const queryCache = useQueryClient();
  const { taskName, publicKey, bountyAmountPerRound, taskManager, isRunning } =
    task;
  const nodes = TaskService.getNodesCount(task);
  const topStake = TaskService.getTopStake(task);

  const { data: myStake, isLoading: isLoadingStake } = useQuery(
    [QueryKeys.myStake, publicKey],
    () => TaskService.getMyStake(task)
  );

  const defaultStakeValue = isLoadingStake
    ? ''
    : TaskService.formatStake(myStake);

  const handleStartTask = async () => {
    try {
      await startTask(publicKey);
    } catch (error) {
      console.warn(error);
    } finally {
      queryCache.invalidateQueries();
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

  const handleStakeValueChange = (value: string) => {
    setStake(value);
  };

  const handleShowCode = () => {
    dispatch(showModal('TASK_DETAILS', task));
  };

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
      <TableCell>{bountyAmountPerRound}</TableCell>
      <TableCell>{nodes}</TableCell>
      <TableCell>{TaskService.formatStake(topStake)}</TableCell>
      <SetStakeCell
        defaultValue={defaultStakeValue}
        onStakeValueChange={handleStakeValueChange}
      />
      <TableCell>
        <Button
          onlyIcon
          icon={isRunning ? <PlayIcon /> : <StopTealIcon />}
          title={isRunning ? 'Stop' : 'Start'}
          //TODO:  should use stake amount as paylaod
          onClick={isRunning ? handleStopTask : handleStartTask}
        />
      </TableCell>
    </TableRow>
  );
};

export default memo(AvailableTaskRow);
