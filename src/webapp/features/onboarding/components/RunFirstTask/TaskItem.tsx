import React, { useState } from 'react';

import CloseIcon from 'assets/svgs/close-icons/close-icon.svg';
import CodeIconSvg from 'assets/svgs/code-icon.svg';

import { EditStakeInput } from '../EditStakeInput';

type PropsType = {
  name: string;
  creator: string;
  minStake: number;
  stakeValue: number;
  onStakeInputChange: (newStake: number) => void;
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
  const handleStakeInputChange = (newStake: number) => {
    setMeetsMinimumStake(newStake >= minStake);
    onStakeInputChange(newStake);
  };

  return (
    <div
      className="grid w-full mb-4 text-sm text-left rounded-md bg-finnieBlue-light-secondary h-13 grid-cols-first-task place-content-center"
      onMouseEnter={handleOnHover}
      onMouseLeave={handleUnhover}
    >
      <CodeIconSvg className="col-span-1 m-auto" />

      <div className="col-span-5 my-auto mr-4 overflow-hidden text-ellipsis">
        {name}
      </div>

      <div className="col-span-5 pr-4 my-auto overflow-hidden text-ellipsis">
        {creator}
      </div>

      <div className="col-span-5 col-start-13 2xl:col-start-15 2xl:col-span-3">
        <EditStakeInput
          stake={stakeValue}
          onChange={handleStakeInputChange}
          meetsMinimumStake={meetsMinimumStake}
          minStake={minStake}
        />
      </div>

      <div
        className="col-span-1 m-auto cursor-pointer text-finnieRed"
        onClick={onRemove}
        title="Remove task"
      >
        <div className="w-6 h-6 mr-2">{hover && <CloseIcon />}</div>
      </div>
    </div>
  );
}

export default TaskItem;
