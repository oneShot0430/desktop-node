import clsx from 'clsx';
import React from 'react';

import RunButton from 'webapp/components/RunButton';

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
      <div className="col-span-5 text-left pl-2">
        <div className="text-lg tracking-finnieSpacing-wider">{name}</div>
        <div className="text-finnieTeal-700 text-2xs">
          02 Dec 2021, 18:15:02
        </div>
      </div>
      <div className="col-span-2 text-sm tracking-finnieSpacing-wider">
        {creator}
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
          <button className="bg-white w-24 h-10 finnie-border-blue rounded-finnie shadow-md font-semibold text-xs tracking-finnieSpacing-wide">
            Withdraw Stake
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskRow;