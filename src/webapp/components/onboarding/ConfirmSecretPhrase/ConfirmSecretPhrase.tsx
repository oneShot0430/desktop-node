import React from 'react';

import { SeedPhraseInput } from 'webapp/components/SeedPhraseInput';

export const ConfirmSecretPhrase = () => {
  return (
    <div className="flex flex-col items-center">
      <SeedPhraseInput
        onPhraseChange={(phrase) => {
          console.log(phrase);
        }}
      />
    </div>
  );
};
