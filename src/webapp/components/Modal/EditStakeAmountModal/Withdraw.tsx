import React, { useState } from 'react';

import { Button } from 'webapp/components/ui/Button';

export type PropsType = { stakedBalance: number; publicKey: string };

export const Withdraw = ({ stakedBalance, publicKey }: PropsType) => {
  const [inputValue, setInputValue] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const value = +e.target.value;
    if (value > stakedBalance) {
      setError('Not enough staked balance');
    }

    setInputValue(value);
  };

  const handleWithdraw = () => {
    setLoading(true);
    // TODO hook up proper endpoint
    Promise.resolve([publicKey, inputValue]).finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="flex flex-col items-center justify-center pt-10 text-finnieBlue-dark">
      {loading && <div>loading...</div>}

      <div className="mb-3">
        Enter the amount you want to withdraw from your stake.
      </div>

      <input
        min="0"
        pattern="[0-9]+"
        type="number"
        value={inputValue}
        className="w-[240px] h-[46px] bg-gray-200 border-b-finnieBlue text-4xl text-right koii_input"
        disabled={loading}
        onChange={handleInputChange}
      />
      {error && <div className="text-finnieRed-500">{error}</div>}

      <div className="py-2 mb-3 text-xs text-finnieTeal-700">{`Current KOII Staked: ${stakedBalance} KOII`}</div>

      <Button label="Withdraw" variant="danger" onClick={handleWithdraw} />
    </div>
  );
};
