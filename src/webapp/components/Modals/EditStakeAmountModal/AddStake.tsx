import React, { useState } from 'react';

import { Button } from 'webapp/components/ui/Button';
import { stakeOnTask } from 'webapp/services/api';

import KoiiInput from './components/KoiiInput';

export type PropsType = { balance: number; publicKey: string };

export const AddStake = ({ balance, publicKey }: PropsType) => {
  const [inputValue, setInputValue] = useState(null);
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
    console.log('###inputValue', inputValue);
    stakeOnTask(publicKey, inputValue).finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center pt-10 text-finnieBlue-dark">
      {loading && <div>loading...</div>}
      <div className="mb-3">
        Enter the amount you want to add to your stake.
      </div>
      <div className="mb-3">
        <KoiiInput onInputChange={handleInputChange} disabled={loading} />
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
