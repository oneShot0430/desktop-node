import clsx from 'clsx';
import React from 'react';

import RunButton from '../RunButton';

type Task = {
  name: string;
  creator: string;
  rewardEarned: number;
  myStake: number;
  state: string;
  status: string;
};

type TaskRowProps = {
  task: Task;
  isOdd: boolean;
};

const TaskRow = ({
  task: { name, creator, rewardEarned, myStake, state, status },
  isOdd,
}: TaskRowProps): JSX.Element => {
  return (
    <div
      className={clsx(
        'pl-9.5 pr-8 grid grid-cols-15 gap-x-3 h-xxl items-center text-center text-finnieBlue',
        status === 'paused' && 'bg-finnieOrange bg-opacity-50',
        status === 'running' && isOdd ? 'bg-trueGray-200' : 'bg-white'
      )}
    >
      <div className="col-span-1 flex items-center justify-center">
        <RunButton
          variant={status === 'running' ? 'pause-active' : 'play-active'}
        />
      </div>
      <div className="col-span-5 text-lg finnieSpacing-wider text-left pl-2">
        {name}
      </div>
      <div className="col-span-2 text-sm finnieSpacing-wider">{creator}</div>
      <div className="col-span-2 text-sm finnieSpacing-wide px-2">
        {rewardEarned}
      </div>
      <div className="col-span-2 text-sm finnieSpacing-wider ">{myStake}</div>
      <div className="col-span-1 text-xs finnieSpacing-wide">{state}</div>
      <div className="col-span-2 justify-self-end">
        <button className="bg-white w-24 h-12 finnie-border-blue rounded-finnie shadow-md font-semibold  text-xs finnieSpacing-wide">
          Withdraw Stake
        </button>
      </div>
    </div>
  );
};

export default TaskRow;
