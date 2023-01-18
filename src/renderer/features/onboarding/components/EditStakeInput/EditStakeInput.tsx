import React, { ChangeEventHandler, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { getKoiiFromRoe, getRoeFromKoii } from 'utils';

interface PropsType {
  stake: number;
  minStake: number;
  meetsMinimumStake: boolean;
  onChange: (newStake: number) => void;
  disabled?: boolean;
}

export const EditStakeInput = ({
  stake,
  minStake,
  meetsMinimumStake,
  onChange,
  disabled = false,
}: PropsType) => {
  const [hasEnteredAValue, setHasEnteredAValue] = useState<boolean>(false);

  const inputClasses = twMerge(
    'w-[92px] rounded-sm text-right text-finnieBlue-dark p-[3px] border border-transparent',
    !meetsMinimumStake && 'border-red-500'
  );
  const stakeInKoii = getKoiiFromRoe(stake);
  const minStakeInKoii = getKoiiFromRoe(minStake);
  const value = hasEnteredAValue && stakeInKoii !== 0 ? stakeInKoii : '';

  const handleChange: ChangeEventHandler<HTMLInputElement> = ({
    target: { value: newStakeInKoii },
  }) => {
    const newStakeInRoe = getRoeFromKoii(Number(newStakeInKoii));
    onChange(newStakeInRoe);
    // we display the placeholder until the user enters a new stake
    setHasEnteredAValue(true);
  };

  return (
    <div>
      <input
        value={value}
        placeholder="0"
        onChange={handleChange}
        type="number"
        className={inputClasses}
        disabled={disabled}
      />
      <div className="text-xs text-finnieEmerald-light">
        min. stake: {minStakeInKoii}
      </div>
    </div>
  );
};
