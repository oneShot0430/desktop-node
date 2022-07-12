import clsx from 'clsx';
import React from 'react';
import { useQuery } from 'react-query';

import LockedIcon from 'svgs/locked-icon.svg';
import InspectButton from 'webapp/components/InspectButton';
import RunButton from 'webapp/components/RunButton';
import { useAppDispatch } from 'webapp/hooks/reduxHook';
import { QueryKeys, TaskService } from 'webapp/services';
import { showTaskInspector } from 'webapp/store/actions/taskInspector';
import { Task } from 'webapp/types';

type TaskRowProps = {
  task: Task;
  isOdd: boolean;
  onChange?: () => void;
};

const TaskRow = ({ task, isOdd, onChange }: TaskRowProps): JSX.Element => {
  const { taskName, taskManager, isRunning, publicKey, bountyAmountPerRound } =
    task;
  const nodes = TaskService.getNodesCount(task);
  const topStake = TaskService.getTopStake(task);
  const minStake = TaskService.getMinStake(task);

  const { data: myStake } = useQuery([QueryKeys.myStake, publicKey], () =>
    TaskService.getMyStake(task)
  );

  const dispatch = useAppDispatch();

  return (
    <div
      className={clsx(
        'pl-6 pr-6 grid grid-cols-16 gap-x-3 h-xxl items-center text-center text-finnieBlue',
        isRunning && isOdd ? 'bg-neutral-200' : 'bg-white'
      )}
    >
      <div className="col-span-1 flex items-center">
        <InspectButton
          onClick={() => dispatch(showTaskInspector('TASK_INSPECTOR', task))}
          size="big"
        />
      </div>
      <div className="col-span-5 text-left">
        <div className="text-lg tracking-finnieSpacing-wider">{taskName}</div>
        <div className="text-finnieTeal-700 text-2xs tracking-finnieSpacing-wider">
          02 Dec 2021, 18:15:02
        </div>
      </div>
      <div className="col-span-2 text-sm tracking-finnieSpacing-wider">
        {taskManager}
      </div>

      <div className="col-span-5 grid grid-cols-3 gap-x-2 items-center">
        <div className="col-span-1 text-sm tracking-finnieSpacing-wide px-2">
          {bountyAmountPerRound}
        </div>
        <div className="col-span-1 text-sm tracking-finnieSpacing-wide">
          {nodes}
        </div>
        <div className="col-span-1 text-sm tracking-finnieSpacing-wider">
          {(Math.round(topStake * 100) / 100).toFixed(2)}
        </div>
      </div>
      <div className="col-span-3 grid grid-cols-5 gap-x-2 items-center">
        <div className="col-span-3 text-xs tracking-finnieSpacing-wider flex flex-col items-center justify-center">
          {myStake !== 0 ? (
            <div className="flex justify-end w-24 mb-1 items-center">
              <div className="tracking-finnieSpacing-wider text-sm text-right mr-2">
                {myStake}
              </div>
              <LockedIcon className="w-3.75 h-5.25" />
            </div>
          ) : (
            <input
              className="w-24 h-8 finnie-border-blue-thin tracking-finnieSpacing-wider rounded-finnie-small shadow-lg text-sm text-right pr-2.5"
              defaultValue={(Math.round(myStake * 100) / 100).toFixed(2)}
            ></input>
          )}

          <div className="text-finnieTeal-700 text-2xs tracking-finnieSpacing-wider">
            min. stake: {minStake}
          </div>
        </div>
        <div className="col-span-2 justify-self-center">
          <RunButton
            isRunning={isRunning}
            taskAccountPubKey={publicKey}
            onStateChange={onChange}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskRow;
