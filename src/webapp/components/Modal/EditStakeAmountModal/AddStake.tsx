import React, { useState } from 'react';

import { Button } from 'webapp/components/ui/Button';
import { stakeOnTask } from 'webapp/services/api';

export type PropsType = { balance: number; publicKey: string };

export const AddStake = ({ balance, publicKey }: PropsType) => {
  const [inputValue, setInputValue] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const value = +e.target.value;
    if (value > balance) {
      setError('Not enough balance');
    }

    setInputValue(value);
  };

  const handleAddStake = () => {
    setLoading(true);
    stakeOnTask(publicKey, inputValue).finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center pt-10 text-finnieBlue-dark">
      {loading && <div>loading...</div>}
      <div className="mb-3">
        Enter the amount you want to withdraw from your stake.
      </div>
      <div className="mb-3">
        <input
          min="0"
          pattern="[0-9]+"
          type="number"
          value={inputValue}
          className="w-[240px] h-[46px] outline-none bg-gray-200 border-b-finnieBlue border-2 text-4xl text-right koii_input"
          disabled={loading}
          onChange={handleInputChange}
        />
        {error && <div className="text-finnieRed-500">{error}</div>}
      </div>
      <div className="py-2 mb-3 text-xs text-finnieTeal-700">{`${balance} KOII available in your balance`}</div>

      <Button
        label="Add Stake"
        disabled={Boolean(error) || loading}
        onClick={handleAddStake}
      />
    </div>
  );
};
