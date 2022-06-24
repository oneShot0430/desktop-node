import React, { useState } from 'react';

import { Button } from 'webapp/ui/Button';

export type PropsType = { balance: number };

export const AddStake = ({ balance }: PropsType) => {
  const [inputValue, setInputValue] = useState(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (inputValue > balance) {
      // TODO: display error
      console.warn('Exceded balance');
    }

    setInputValue(Number(e.target.value));
  };

  const handleAddStake = () => {
    console.log('###withdraw');
  };

  return (
    <div className="flex flex-col items-center justify-center pt-10 text-finnieBlue-dark">
      <div className="mb-3">
        Enter the amount you want to withdraw from your stake.
      </div>
      <div className="mb-3">
        <input
          min="0"
          pattern="[0-9]+"
          type="number"
          value={inputValue}
          className="w-[240px] h-[46px] bg-gray-200 border-b-finnieBlue border-2 text-4xl text-right koii_input"
          onChange={handleInputChange}
        />
      </div>
      <div className="py-2 mb-3 text-xs text-finnieTeal-700">{`${balance} KOII available in your balance`}</div>

      <Button label="Add Stake" onClick={handleAddStake} />
    </div>
  );
};
