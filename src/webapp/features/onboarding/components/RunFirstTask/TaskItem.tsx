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
    <tr
      className="bg-finnieBlue-light-secondary h-13 rounded-md text-sm"
      onMouseEnter={handleOnHover}
      onMouseLeave={handleUnhover}
    >
      <td className="rounded-l-md">
        <CodeIconSvg className="mx-4" />
      </td>
      <td className="text-ellipsis overflow-hidden">
        <div className="mr-4">{name}</div>
      </td>
      <td className="w-fit" title={creator}>
        <div className="max-w-xs xl:max-w-[420px] text-ellipsis overflow-hidden m-0">
          {creator}
        </div>
      </td>
      <td title={level} className="">
        <div className="mr-4">{level}</div>
      </td>
      <td title={String(stakeValue)}>
        <div className="mr-2 w-22.5 flex flex-col gap-1">
          <input
            value={stakeValue}
            onChange={onStakeInputChange}
            type="number"
            className="rounded-sm text-right text-finnieBlue-dark p-0.75 w-full"
          />
          <div className="text-xs text-finnieEmerald-light leading-3">{`min. stake: ${minStake}`}</div>
        </div>
      </td>
      <td
        className="cursor-pointer text-finnieRed rounded-r-md"
        onClick={onRemove}
        title="Remove task"
      >
        <div className="w-6 h-6 mr-2">{hover && <CloseIcon />}</div>
      </td>
    </tr>
  );
}

export default TaskItem;
