import React, { memo, useState } from 'react';

type PropsType = {
  disabled: boolean;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const KoiiInput = ({ disabled, onInputChange }: PropsType) => {
  const [inputValue, setInputValue] = useState(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(+e.target.value);
    onInputChange(e);
  };

  return (
    <div className="w-[240px] h-[46px] outline-none bg-gray-200 border-b-finnieBlue border-2 text-4xl text-right flex justify-between items-center inner focus-within:bg-white">
      <input
        className="w-[100%] text-right bg-gray-200 focus:bg-white focus:border-none focus:outline-none pl-2"
        pattern="[0-9]+"
        type="number"
        value={inputValue}
        disabled={disabled}
        onChange={handleInputChange}
        placeholder="00"
      />
      <div className="p-2">KOII</div>
    </div>
  );
};

export default memo(KoiiInput);
