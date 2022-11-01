import React, { useState } from 'react';

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
  const [hover, setHover] = useState(false);

  const handleOnHover = () => {
    setHover(true);
  };
  const handleUnhover = () => {
    setHover(false);
  };

  return (
    <div
      className="bg-finnieBlue-light-secondary h-13 rounded-md text-sm mb-4 text-left w-full grid grid-cols-first-task place-content-center"
      onMouseEnter={handleOnHover}
      onMouseLeave={handleUnhover}
    >
      <CodeIconSvg className="m-auto col-span-1" />

      <div className="text-ellipsis overflow-hidden my-auto mr-4 col-span-4">
        {name}
      </div>

      <div className="text-ellipsis overflow-hidden  my-auto pr-4 col-span-4">
        {creator}
      </div>

      <div className="my-auto mr-4 col-span-2">{level}</div>

      <div className="mr-2 flex flex-col gap-1 col-span-1">
        <input
          value={stakeValue}
          onChange={onStakeInputChange}
          type="number"
          className="rounded-sm text-right text-finnieBlue-dark p-0.75 w-full"
        />
        <div className="text-xs text-finnieEmerald-light leading-3">{`min. stake: ${minStake}`}</div>
      </div>

      <div
        className="cursor-pointer text-finnieRed col-span-1 m-auto"
        onClick={onRemove}
        title="Remove task"
      >
        <div className="w-6 h-6 mr-2">{hover && <CloseIcon />}</div>
      </div>
    </div>
  );
}

export default TaskItem;
