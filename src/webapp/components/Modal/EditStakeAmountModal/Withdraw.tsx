import React, { useState } from 'react';

import { Button } from 'webapp/components/ui/Button';

export type PropsType = { stakedBalance: number };

export const Withdraw = ({ stakedBalance }: PropsType) => {
  const [inputValue, setInputValue] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (inputValue > stakedBalance) {
      // TODO: display error
      console.warn('Exceded balance');
    }

    setInputValue(Number(e.target.value));
  };

  const handleWithdraw = () => {
    console.log('###withdraw');
  };

  return (
    <div className="flex flex-col items-center justify-center pt-10 text-finnieBlue-dark">
      <div className="mb-3">
        Enter the amount you want to withdraw from your stake.
      </div>

      <input
        min="0"
        pattern="[0-9]+"
        type="number"
        value={inputValue}
        className="w-[240px] h-[46px] bg-gray-200 border-b-finnieBlue text-4xl text-right koii_input"
        onChange={handleInputChange}
      />

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
