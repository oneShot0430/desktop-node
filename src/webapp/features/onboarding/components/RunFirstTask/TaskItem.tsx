import React, { useState, ChangeEventHandler } from 'react';

import CloseIcon from 'assets/svgs/close-icons/close-icon.svg';
import CodeIconSvg from 'assets/svgs/code-icon.svg';

import { EditStakeInput } from '..';

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
  const [meetsMinimumStake, setMeetsMinimumStake] = useState<boolean>(false);

  const handleOnHover = () => {
    setHover(true);
  };
  const handleUnhover = () => {
    setHover(false);
  };
  const handleStakeInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setMeetsMinimumStake(stakeValue >= minStake);
    onStakeInputChange(e);
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

      <div className="mr-2 col-span-1">
        <EditStakeInput
          stake={stakeValue}
          onChange={handleStakeInputChange}
          meetsMinimumStake={meetsMinimumStake}
          minStake={minStake}
        />
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
