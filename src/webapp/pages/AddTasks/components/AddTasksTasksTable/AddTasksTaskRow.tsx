import clsx from 'clsx';
import React from 'react';

import LockedIcon from 'svgs/locked-icon.svg';
import InspectButton from 'webapp/components/InspectButton';
import RunButton from 'webapp/components/RunButton';

type Task = {
  name: string;
  creator: string;
  bounty: number;
  nodes: number;
  topStake: number;
  stake: number;
  minStake: number;
  status: string;
};

type TaskRowProps = {
  task: Task;
  isOdd: boolean;
};

const TaskRow = ({
  task: { name, creator, bounty, nodes, topStake, stake, minStake, status },
  isOdd,
}: TaskRowProps): JSX.Element => {
  return (
    <div
      className={clsx(
        'pl-6 pr-6 grid grid-cols-16 gap-x-3 h-xxl items-center text-center text-finnieBlue',
        status === 'paused' && 'bg-finnieOrange bg-opacity-50',
        status === 'running' && isOdd ? 'bg-trueGray-200' : 'bg-white'
      )}
    >
      <div className="col-span-1 flex items-center">
        <InspectButton size="big" />
      </div>
      <div className="col-span-5 text-left">
        <div className="text-lg tracking-finnieSpacing-wider">{name}</div>
        <div className="text-finnieTeal-700 text-2xs tracking-finnieSpacing-wider">
          02 Dec 2021, 18:15:02
        </div>
      </div>
      <div className="col-span-2 text-sm tracking-finnieSpacing-wider">
        {creator}
      </div>

      <div className="col-span-5 grid grid-cols-3 gap-x-2 items-center">
        <div className="col-span-1 text-sm tracking-finnieSpacing-wide px-2">
          {bounty}
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
          {stake !== 0 ? (
            <div className="flex justify-end w-24 mb-1 items-center">
              <div className="tracking-finnieSpacing-wider text-sm text-right mr-2">
                {stake}
              </div>
              <LockedIcon className="w-3.75 h-5.25" />
            </div>
          ) : (
            <input
              className="w-24 h-8 finnie-border-blue-thin tracking-finnieSpacing-wider rounded-finnie-small shadow-lg text-sm text-right pr-2.5"
              defaultValue={(Math.round(stake * 100) / 100).toFixed(2)}
            ></input>
          )}

          <div className="text-finnieTeal-700 text-2xs tracking-finnieSpacing-wider">
            min. stake: {minStake}
          </div>
        </div>
        <div className="col-span-2 justify-self-center">
          <RunButton
            variant={
              status === 'running'
                ? 'pause-active'
                : stake !== 0
                ? 'play-active'
                : 'play-deactivated'
            }
          />
        </div>
      </div>
    </div>
  );
};

export default TaskRow;
