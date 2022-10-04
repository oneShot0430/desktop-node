import React, { useState } from 'react';

import { Button } from 'webapp/components/ui/Button';

import KoiiInput from './KoiiInput';

export type PropsType = {
  balance: number;
  onAddStake: (amount: number) => void;
};

export const AddStake = ({ balance, onAddStake }: PropsType) => {
  const [inputValue, setInputValue] = useState(null);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const value = +e.target.value;
    if (value > balance) {
      setError('Not enough balance');
    }

    setInputValue(value);
  };

  const handleAddStake = () => {
    onAddStake(inputValue);
  };

  return (
    <div className="flex flex-col items-center justify-center pt-10 text-finnieBlue-dark">
      <div className="mb-3">
        Enter the amount you want to add to your stake.
      </div>
      <div className="mb-3">
        <KoiiInput onInputChange={handleInputChange} />
        {error && <div className="text-finnieRed-500">{error}</div>}
      </div>
      <div className="py-2 mb-3 text-xs text-finnieTeal-700">{`${balance} KOII available in your balance`}</div>

      <Button label="Add Stake" onClick={handleAddStake} />
    </div>
  );
};
