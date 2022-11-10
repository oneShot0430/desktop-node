import React, { ChangeEventHandler } from 'react';
import { twMerge } from 'tailwind-merge';

import { getKoiiFromRoe, getRoeFromKoii } from 'utils';

interface PropsType {
  stake: number;
  minStake: number;
  meetsMinimumStake: boolean;
  onChange: (newStake: number) => void;
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
  const stakeInKoii = getKoiiFromRoe(stake);
  const minStakeInKoii = getKoiiFromRoe(minStake);

  const handleChange: ChangeEventHandler<HTMLInputElement> = ({
    target: { value: newStakeInKoii },
  }) => {
    const newStakeInRoe = getRoeFromKoii(Number(newStakeInKoii));
    onChange(newStakeInRoe);
  };

  return (
    <div>
      <input
        value={stakeInKoii}
        onChange={handleChange}
        type="number"
        className={inputClasses}
      />
      <div className="text-xs text-finnieEmerald-light">
        min. stake: {minStakeInKoii}
      </div>
    </div>
  );
};
