import React, { ChangeEventHandler } from 'react';

interface PropsType {
  stake: number;
  minStake: number;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export const EditStakeInput = ({ stake, minStake, onChange }: PropsType) => {
  return (
    <div>
      <input
        value={stake}
        onChange={onChange}
        type="number"
        className="w-[92px] rounded-sm text-right text-finnieBlue-dark p-[3px]"
      />
      <div className="text-xs text-finnieEmerald-light">
        min. stake: {minStake}
      </div>
    </div>
  );
};
