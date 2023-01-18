import React, { useState } from 'react';

import { getRoeFromKoii, getKoiiFromRoe } from 'utils';
import { ErrorMessage, Button } from 'renderer/components';

import KoiiInput from './KoiiInput';

export type PropsType = {
  balance: number;
  currentStake: number;
  minStake: number;
  onAddStake: (amount: number) => void;
};

export const AddStake = ({
  balance,
  currentStake,
  minStake,
  onAddStake,
}: PropsType) => {
  const [inputValue, setInputValue] = useState(0);
  const [error, setError] = useState('');
  const stakeToAddInRoe = getRoeFromKoii(inputValue);
  const minStakeInKoii = getKoiiFromRoe(minStake);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const stakeToAdd = +e.target.value;
    const stakeToAddInRoe = getRoeFromKoii(stakeToAdd);
    const meetsMinStake = stakeToAddInRoe + currentStake >= minStake;
    if (!meetsMinStake) {
      setError(`Min stake: ${minStakeInKoii} KOII`);
    } else if (stakeToAdd > balance) {
      setError('Not enough balance');
    }

    setInputValue(stakeToAdd);
  };

  const handleAddStake = () => {
    onAddStake(stakeToAddInRoe);
  };

  return (
    <div className="flex flex-col items-center justify-center pt-10 text-finnieBlue-dark">
      <div className="mb-3">
        Enter the amount you want to add to your stake.
      </div>
      <div className="mb-3">
        <KoiiInput onInputChange={handleInputChange} />
        {error && <ErrorMessage error={error} />}
      </div>

      <div className="py-2 mb-3 text-xs text-finnieTeal-700">{`${balance} KOII available in your balance`}</div>

      <Button
        label="Add Stake"
        onClick={handleAddStake}
        className="text-white"
        disabled={!!error}
      />
    </div>
  );
};
