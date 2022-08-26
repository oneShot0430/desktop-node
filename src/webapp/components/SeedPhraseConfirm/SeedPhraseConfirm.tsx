import React, { useEffect, useMemo, useState } from 'react';

import { ErrorMessage } from '../ui/ErrorMessage';

import { pickRandomNumbers } from './pickRandomNumbers';

type PropsType = {
  onPhraseChange: (phrase: string) => void;
  seedPhraseValue?: string;
  error?: string;
};

export const SeedPhraseConfirm = ({
  onPhraseChange,
  seedPhraseValue,
  error,
}: PropsType) => {
  const [phrases, setPhrases] = useState<string[]>(new Array(12).fill(''));
  const numbers = useMemo(() => pickRandomNumbers(6), []);

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

  const seedPhraseValueArray = useMemo(
    () => seedPhraseValue && seedPhraseValue.split(' '),
    [seedPhraseValue]
  );

  useEffect(() => {
    if (seedPhraseValue) {
      setPhrases(
        seedPhraseValueArray.map((phrase, index) =>
          numbers.includes(index) ? '' : phrase
        )
      );
    }
  }, [seedPhraseValue]);

  return (
    <div className="flex flex-col">
      <div className="columns-2 bg-finnieBlue-light-secondary w-[360px] rounded py-4 px-[30px] select-text mb-4">
        {phrases.map((phrase, index) => {
          const maskWord = numbers.includes(index);
          const wordNumber = index + 1;

          return maskWord ? (
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
          ) : (
            <div
              className="flex flex-row items-center justify-start gap-4 mb-2 select-text"
              key={index}
            >
              <div>{wordNumber}</div>
              <div>{phrase}</div>
            </div>
          );
        })}
      </div>
      {error && <ErrorMessage errorMessage={error} />}
    </div>
  );
};
