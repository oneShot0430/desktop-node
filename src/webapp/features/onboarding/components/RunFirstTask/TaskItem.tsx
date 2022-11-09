import React, { useState, ChangeEventHandler } from 'react';

import CloseIcon from 'assets/svgs/close-icons/close-icon.svg';
import CodeIconSvg from 'assets/svgs/code-icon.svg';

import { EditStakeInput } from '..';

type PropsType = {
  name: string;
  creator: string;
  minStake: number;
  stakeValue: number;
  onStakeInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
};

function TaskItem({
  name,
  creator,
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

      <div className="text-ellipsis overflow-hidden my-auto mr-4 col-span-5">
        {name}
      </div>

      <div className="text-ellipsis overflow-hidden  my-auto pr-4 col-span-5">
        {creator}
      </div>

      <div className="col-start-13 col-span-5 2xl:col-start-15 2xl:col-span-3">
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
