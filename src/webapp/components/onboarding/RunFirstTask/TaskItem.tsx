import React from 'react';

import CodeIconSvg from 'assets/svgs/code-icon.svg';

type PropsType = {
  name: string;
  creator: string;
  level: string;
  minStake: string;
};

function TaskItem({ name, creator, level, minStake }: PropsType) {
  return (
    <div className="flex flex-row bg-finnieBlue-light-secondary h-[52px] items-center rounded-md pl-4 text-sm">
      <div className="mr-4">
        <CodeIconSvg />
      </div>
      <div className="w-[214px] mr-4">{name}</div>
      <div className="w-[112px] mr-4">{creator}</div>
      <div className="w-[60px] mr-4">{level}</div>
      <div>
        <input
          type="number"
          className="w-[92px] rounded-sm text-right text-finnieBlue-dark p-[3px]"
        />
        <div className="text-xs text-finnieEmerald-light">{`min. stake: ${minStake}`}</div>
      </div>
    </div>
  );
}

export default TaskItem;
