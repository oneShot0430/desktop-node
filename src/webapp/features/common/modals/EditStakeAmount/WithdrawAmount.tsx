import React, { useState } from 'react';

import { Button } from 'webapp/components/ui/Button';

import KoiiInput from './KoiiInput';

export type PropsType = {
  stakedBalance: number;
  onWithdraw: (amount: number) => void;
};

// TODO: currently API does not support partial stake withdrawal
export const WithdrawAmount = ({ stakedBalance, onWithdraw }: PropsType) => {
  const [inputValue, setInputValue] = useState(0);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const value = +e.target.value;
    if (value > stakedBalance) {
      setError('Not enough staked balance');
    }

    setInputValue(value);
  };

  const handleWithdraw = async () => {
    onWithdraw(inputValue);
  };

  return (
    <div className="flex flex-col items-center justify-center pt-10 text-finnieBlue-dark">
      <div className="mb-3">
        Enter the amount you want to withdraw from your stake.
      </div>

      <KoiiInput onInputChange={handleInputChange} />

      {error && <div className="text-finnieRed-500">{error}</div>}

      <div className="py-2 mb-3 text-xs text-finnieTeal-700">{`Current KOII Staked: ${stakedBalance} KOII`}</div>

      <Button
        label="Withdraw"
        variant="danger"
        onClick={handleWithdraw}
        disabled={Boolean(error)}
        className="bg-finnieRed text-finnieBlue-light-secondary"
      />
    </div>
  );
};
