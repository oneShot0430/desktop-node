import React, { ChangeEventHandler } from 'react';
import { twMerge } from 'tailwind-merge';

interface PropsType {
  stake: number;
  minStake: number;
  meetsMinimumStake: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export const EditStakeInput = ({
  stake,
  minStake,
  meetsMinimumStake,
  onChange,
}: PropsType) => {
  const inputClasses = twMerge(
    'w-[92px] rounded-sm text-right text-finnieBlue-dark p-[3px]',
    !meetsMinimumStake && 'border border-red-500'
  );

  return (
    <div>
      <input
        value={stake}
        onChange={onChange}
        type="number"
        className={inputClasses}
      />
      <div className="text-xs text-finnieEmerald-light">
        min. stake: {minStake}
      </div>
    </div>
  );
};
