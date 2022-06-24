import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import { Task } from 'webapp/@type/task';
import InspectButton from 'webapp/components/InspectButton';
import RunButton from 'webapp/components/RunButton';
import { useAppDispatch } from 'webapp/hooks/reduxHook';
import { TaskService, TaskStatusToLabeMap } from 'webapp/services/taskService';
import { showModal } from 'webapp/store/actions/modal';
import { showTaskInspector } from 'webapp/store/actions/taskInspector';

type TaskRowProps = {
  task: Task;
  isOdd: boolean;
  onChange?: () => void;
};

const MyNodeTaskRow = ({
  task,
  isOdd,
  onChange,
}: TaskRowProps): JSX.Element => {
  const { taskName, taskManager, isRunning, publicKey } = task;

  const [rewardEarned, setRewardEarned] = useState(0);

  useEffect(() => {
    //TODO:  GET REWARD FROM API
    setRewardEarned(0);
  }, []);

  const myStake = TaskService.getMyStake(task);
  const state = TaskStatusToLabeMap[TaskService.getStatus(task)];

  const dispatch = useAppDispatch();

  return (
    <div
      className={clsx(
        'pl-9.5 pr-8 grid grid-cols-15 gap-x-3 h-xxl items-center text-center text-finnieBlue',
        isRunning && isOdd ? 'bg-neutral-200' : 'bg-white'
      )}
    >
      <div className="col-span-1 flex items-center justify-center">
        <RunButton
          isRunning={isRunning}
          taskAccountPubKey={publicKey}
          onStateChange={onChange}
        />
      </div>
      <div className="col-span-5 text-left pl-2">
        <div className="text-lg tracking-finnieSpacing-wider">{taskName}</div>
        <div className="flex justify-between w-48 text-finnieTeal-700 text-2xs tracking-finnieSpacing-wider">
          02 Dec 2021, 18:15:02
          <InspectButton
            onClick={() => dispatch(showTaskInspector('TASK_INSPECTOR', task))}
            size="small"
          />
        </div>
      </div>
      <div className="col-span-2 text-sm tracking-finnieSpacing-wider">
        <span title={taskManager}>{taskManager.substring(0, 6)}...</span>
      </div>
      <div className="col-span-2 text-sm tracking-finnieSpacing-wide px-2">
        {rewardEarned}
      </div>
      <div className="col-span-2 text-sm tracking-finnieSpacing-wider ">
        {myStake}
      </div>
      <div className="col-span-3 grid grid-cols-2 gap-x-2 items-center">
        <div className="col-span-1 text-xs tracking-finnieSpacing-wide">
          {state}
        </div>
        <div className="col-span-1 justify-self-end">
          <button
            onClick={() =>
              dispatch(
                showModal('WITHDRAW_STAKE', {
                  name: taskName,
                  creator: taskManager,
                  rewardEarned,
                })
              )
            }
            className="bg-white w-24 h-10 finnie-border-blue rounded-finnie shadow-md font-semibold text-xs tracking-finnieSpacing-wide"
          >
            Withdraw Stake
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyNodeTaskRow;
