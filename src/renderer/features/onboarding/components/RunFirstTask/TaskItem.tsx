import React, { useState } from 'react';

import CloseIcon from 'assets/svgs/close-icons/close-icon.svg';
import CodeIconSvg from 'assets/svgs/code-icon.svg';
import { Tooltip } from 'renderer/components';

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
  const [meetsMinimumStake, setMeetsMinimumStake] = useState<boolean>(false);

  const handleStakeInputChange = (newStake: number) => {
    setMeetsMinimumStake(newStake >= minStake);
    onStakeInputChange(newStake);
  };

  return (
    <div className="grid w-full mb-4 text-sm text-left rounded-md bg-finnieBlue-light-secondary h-13 grid-cols-first-task place-content-center">
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

      <div className="m-auto cursor-pointer text-finnieRed" onClick={onRemove}>
        <Tooltip placement="top-left" tooltipContent="Remove task">
          <div className="w-6 mr-2">
            <CloseIcon />
          </div>
        </Tooltip>
      </div>
    </div>
  );
}

export default TaskItem;
