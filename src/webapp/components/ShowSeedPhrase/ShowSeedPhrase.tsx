import React, { useState } from 'react';

import LockIconSvg from 'assets/svgs/onboarding/lock-icon-lg.svg';

type PropsType = {
  seedPhrase: string;
  onPhraseReveal?: () => void;
};

export const ShowSeedPhrase = ({
  seedPhrase = '',
  onPhraseReveal,
}: PropsType) => {
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);

  const seedPhraseArray = seedPhrase
    ? seedPhrase.split(' ')
    : Array(12).fill('');

  return (
    <div className="relative">
      {!showSeedPhrase && (
        <div
          className="absolute top-0 left-0 w-full h-full backdrop-blur-sm bg-gray/30"
          onClick={() => {
            setShowSeedPhrase(true);
            onPhraseReveal && onPhraseReveal();
          }}
        >
          <div className="flex flex-col items-center justify-center w-full h-full">
            <LockIconSvg />
            <p> Tap to unlock</p>
          </div>
        </div>
      )}
      <div className="flex justify-center">
        <div className="columns-2 bg-finnieBlue-light-secondary w-[360px] rounded py-4 px-[30px] select-text">
          {(seedPhraseArray ?? []).map((phrase, index) => {
            const wordNumber = index + 1;
            return (
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
      </div>
    </div>
  );
};
