import React, { useState } from 'react';

type PropsType = {
  onPhraseChange: (phrase: string) => void;
  seedPhrase?: string;
};

export const SeedPhraseInput = ({ onPhraseChange }: PropsType) => {
  const [phrases, setPhrases] = useState<string[]>(new Array(12).fill(''));

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    phraseIndex: number
  ) => {
    const value = e.target.value;
    const newPhrases = Object.assign([], phrases, {
      [phraseIndex]: value,
    });
    setPhrases(newPhrases);
    onPhraseChange && onPhraseChange(newPhrases.join(' '));
  };

  return (
    <div className="columns-2 bg-finnieBlue-light-secondary w-[360px] rounded py-4 px-[30px] select-text">
      {phrases.map((_, index) => {
        const wordNumber = index + 1;
        return (
          <div
            className="flex flex-row items-center justify-between mb-2"
            key={index}
          >
            <div>{wordNumber}</div>
            <input
              className="w-[120px] bg-transparent focus:border-b focus:border-white focus:outline-none text-sm"
              onChange={(e) => handleInputChange(e, index)}
              value={phrases[index]}
            />
          </div>
        );
      })}
    </div>
  );
};
