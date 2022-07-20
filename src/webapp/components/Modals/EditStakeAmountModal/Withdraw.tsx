import React, { useState } from 'react';

import { Button } from 'webapp/components/ui/Button';
import { withdrawStake } from 'webapp/services';

import KoiiInput from './components/KoiiInput';

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

  const handleWithdraw = async () => {
    try {
      setLoading(true);
      // TODO:
      await withdrawStake(publicKey, inputValue);
    } catch (error) {
      console.log('###withdraw stake error ->', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center pt-10 text-finnieBlue-dark">
      {loading && <div>loading...</div>}

      <div className="mb-3">
        Enter the amount you want to withdraw from your stake.
      </div>

      <KoiiInput onInputChange={handleInputChange} disabled={loading} />

      {error && <div className="text-finnieRed-500">{error}</div>}

      <div className="py-2 mb-3 text-xs text-finnieTeal-700">{`Current KOII Staked: ${stakedBalance} KOII`}</div>

      <Button
        label="Withdraw"
        variant="danger"
        onClick={handleWithdraw}
        className="bg-finnieRed text-finnieBlue-light-secondary"
      />
    </div>
  );
};
