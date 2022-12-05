import ArrowTopIcon from 'assets/svgs/arrow-top-icon.svg';
import TooltipIcon from 'assets/svgs/tooltip-icon.svg';
import React, { useCallback, useState } from 'react';

import KeyIconSvg from 'assets/svgs/key-icon-white.svg';
import { Button } from 'webapp/components';
import { Task } from 'webapp/types';

type PropsType = {
  task: Task;
  onGetSecretClick: (task: Task) => void;
};

export const TaskSecretsRow = ({ task, onGetSecretClick }: PropsType) => {
  const [isExpanded, setExpand] = useState(false);
  const handleExpand = () => {
    setExpand(true);
  };
  const handleShrink = () => {
    setExpand(false);
  };

  const handleGetSecretClick = useCallback(() => {
    onGetSecretClick(task);
  }, [onGetSecretClick, task]);

  return (
    <div
      className={`border-gray-700 overflow-hidden border-b-[0.5px] text-xs ${
        isExpanded ? 'h-[232px]' : 'h-[60px]'
      }`}
    >
      <div className={'flex items-center w-full h-[60px]'}>
        <div className="px-2 w-[60px]">
          <KeyIconSvg />
        </div>
        <div className="flex flex-col w-[30%] gap-1">
          <div>{task.taskName}</div>
          <div className="text-finnieTeal">{Date.now()}</div>
        </div>
        <div className="w-[15%]">{task.taskName}</div>
        <div className="flex items-center gap-2">
          <TooltipIcon onClick={handleExpand} className="cursor-pointer" />
          {isExpanded && (
            <Button
              onClick={handleShrink}
              icon={<ArrowTopIcon />}
              className="w-6 h-6 rounded-full bg-finnieTeal"
            />
          )}
        </div>
      </div>

      <div className="pl-[60px] flex flex-col gap-2 mt-7">
        <BottomRow label="Secret Type" value={'Api Key'} />
        <BottomRow label="Requirements" value={'Credit Card, Government ID'} />
        <BottomRow label="Restricted Access" value={'None'} />
        <Button
          label="Get Secret"
          className="mt-5 text-purple-3 font-semibold bg-finnieGray-light w-[200px] h-[36px]"
          onClick={handleGetSecretClick}
        />
      </div>
    </div>
  );
};

const BottomRow = ({
  label = '',
  value = '',
}: {
  label: string;
  value: string;
}) => {
  return (
    <div className="flex items-center">
      <div className="w-[30%] text-finnieTeal-100">{label}:</div>
      <div className="pl-[18px]">{value}</div>
    </div>
  );
};
