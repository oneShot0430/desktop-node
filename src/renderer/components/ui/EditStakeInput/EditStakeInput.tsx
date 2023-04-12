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

export function EditStakeInput({
  stake,
  minStake,
  meetsMinimumStake,
  onChange,
  disabled = false,
}: PropsType) {
  const [isPristine, setIsPristine] = useState<boolean>(true);
  const [hasEnteredAValue, setHasEnteredAValue] = useState<boolean>(false);

  const hasError = !meetsMinimumStake && !isPristine;
  const inputClasses = twMerge(
    'w-[92px] rounded-sm text-right text-finnieBlue-dark p-[3px] border-2 border-transparent focus:border-finnieEmerald focus:outline-none',
    hasError && 'border-finnieRed focus:border-finnieRed'
  );
  const minStakeLabelClasses = `text-xs text-center ${
    hasError ? 'text-finnieRed' : 'text-finnieEmerald-light'
  }`;
  const stakeInKoii = getKoiiFromRoe(stake);
  const minStakeInKoii = getKoiiFromRoe(minStake);
  const value =
    (hasEnteredAValue || disabled) && stakeInKoii !== 0 ? stakeInKoii : '';

  const handleChange: ChangeEventHandler<HTMLInputElement> = ({
    target: { value: newStakeInKoii },
  }) => {
    const newStakeInRoe = getRoeFromKoii(Number(newStakeInKoii));
    onChange(newStakeInRoe);
    // we display the placeholder until the user enters a new stake
    setHasEnteredAValue(true);
  };

  return (
    <div className="flex flex-col items-center w-fit">
      <input
        onBlur={() => setIsPristine(false)}
        value={value}
        placeholder="0"
        onChange={handleChange}
        type="number"
        className={inputClasses}
        disabled={disabled}
      />
      <div className={minStakeLabelClasses}>minimum: {minStakeInKoii}</div>
    </div>
  );
}
