import React from 'react';

import CloseIcon from 'assets/svgs/close-icons/close-icon.svg';
import CodeIconSvg from 'assets/svgs/code-icon.svg';

type PropsType = {
  name: string;
  creator: string;
  level: string;
  minStake: number;
  stakeValue: number;
  onStakeInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
};

function TaskItem({
  name,
  creator,
  level,
  minStake,
  stakeValue,
  onStakeInputChange,
  onRemove,
}: PropsType) {
  return (
    <div className="grid w-full mb-4 text-sm text-left rounded-md bg-finnieBlue-light-secondary h-13 grid-cols-first-task place-content-center">
      <CodeIconSvg className="col-span-1 m-auto" />

      <div className="col-span-4 my-auto mr-4 overflow-hidden text-ellipsis">
        {name}
      </div>

      <div className="col-span-4 pr-4 my-auto overflow-hidden text-ellipsis">
        {creator}
      </div>

      <div className="col-span-2 my-auto mr-4">{level}</div>

      <div className="flex flex-col col-span-1 gap-1 mr-2">
        <input
          value={stakeValue}
          onChange={onStakeInputChange}
          type="number"
          className="rounded-sm text-right text-finnieBlue-dark p-0.75 w-full"
        />
        <div className="text-xs leading-3 text-finnieEmerald-light">{`min. stake: ${minStake}`}</div>
      </div>

      <div
        className="col-span-1 m-auto cursor-pointer text-finnieRed"
        onClick={onRemove}
        title="Remove task"
      >
        <div className="w-6 h-6 mr-2">
          <CloseIcon />
        </div>
      </div>
    </div>
  );
}

export default TaskItem;
