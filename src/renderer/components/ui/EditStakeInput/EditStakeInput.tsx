import React, { ChangeEventHandler, useState } from 'react';
import { twMerge } from 'tailwind-merge';

import { getKoiiFromRoe, getRoeFromKoii } from 'utils';

interface PropsType {
  stake: number;
  minStake: number;
  meetsMinimumStake: boolean;
  onChange: (newStake: number) => void;
  disabled?: boolean;
  defaultValue?: number;
}

export function EditStakeInput({
  stake,
  minStake,
  meetsMinimumStake,
  onChange,
  disabled = false,
  defaultValue,
}: PropsType) {
  const [isPristine, setIsPristine] = useState<boolean>(true);

  const hasError = !meetsMinimumStake && !isPristine;
  const inputClasses = twMerge(
    'w-[92px] rounded-sm text-right text-finnieBlue-dark p-[3px] border-2 border-transparent focus:border-finnieEmerald focus:outline-none',
    hasError && 'border-finnieRed focus:border-finnieRed'
  );
  const labelClasses = twMerge(
    'text-xs text-center h-4 min-h-4 pt-1',
    hasError ? 'text-finnieRed' : 'text-finnieTeal-100'
  );
  const stakeInKoii = getKoiiFromRoe(stake);
  const minStakeInKoii = getKoiiFromRoe(minStake);
  const value = stakeInKoii !== 0 ? stakeInKoii : '';
  const placeholder = defaultValue ? String(getKoiiFromRoe(defaultValue)) : '0';

  const handleChange: ChangeEventHandler<HTMLInputElement> = ({
    target: { value: newStakeInKoii },
  }) => {
    const newStakeInRoe = getRoeFromKoii(Number(newStakeInKoii));
    onChange(newStakeInRoe);
  };

  return (
    <div className="flex flex-col items-center w-fit">
      <input
        onBlur={() => setIsPristine(false)}
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        type="number"
        className={inputClasses}
        disabled={disabled}
        defaultValue={defaultValue}
      />
      <div className={labelClasses}>
        {!!minStakeInKoii && `Min stake: ${minStakeInKoii} KOII`}
      </div>
    </div>
  );
}
