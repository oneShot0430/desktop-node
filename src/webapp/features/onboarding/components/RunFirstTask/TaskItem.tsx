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

  return (
    <div
      className="flex flex-row bg-finnieBlue-light-secondary h-[52px] items-center rounded-md px-4 text-sm justify-between"
      onMouseEnter={handleOnHover}
      onMouseLeave={() => setHover(false)}
    >
      <div className="flex flex-row items-center">
        <div className="mr-4">
          <CodeIconSvg />
        </div>
        <div className="w-[214px] mr-4">{name}</div>
        <div
          className="w-[112px] mr-4 text-ellipsis overflow-hidden"
          title={creator}
        >
          {creator}
        </div>
        <div className="w-[60px] mr-4">{level}</div>
        <div>
          <input
            value={stakeValue}
            onChange={onStakeInputChange}
            type="number"
            className="w-[92px] rounded-sm text-right text-finnieBlue-dark p-[3px]"
          />
          <div className="text-xs text-finnieEmerald-light">{`min. stake: ${minStake}`}</div>
        </div>
      </div>
      {hover && (
        <div
          className="w-6 h-6 cursor-pointer text-finnieRed"
          onClick={onRemove}
          title="Remove task"
        >
          <CloseIcon />
        </div>
      )}
    </div>
  );
}

export default TaskItem;
