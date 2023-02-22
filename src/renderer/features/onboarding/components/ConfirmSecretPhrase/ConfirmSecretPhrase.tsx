import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SeedPhraseConfirm } from 'renderer/components/SeedPhraseConfirm/SeedPhraseConfirm';
import { Button } from 'renderer/components/ui';
import { AppRoute } from 'renderer/types/routes';

import { useOnboardingContext } from '../../context/onboarding-context';

export function ConfirmSecretPhrase() {
  const { newSeedPhrase } = useOnboardingContext();
  const [phrase, setPhrase] = useState('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  return (
    <div className="pl-[12vw] pt-[160px]">
      <div className="flex flex-col items-end w-fit">
        <div className="w-full mb-4 text-2xl font-semibold">
          Confirm your Secret Phrase
        </div>
        <div className="w-full mb-8">
          Type in the missing words to confirm your secret
          <br /> phrase is secured.
        </div>
        <SeedPhraseConfirm
          seedPhraseValue={newSeedPhrase}
          onPhraseChange={(seedPhrase) => {
            setPhrase(seedPhrase);
          }}
          error={error}
        />

        <div className="mt-8">
          <Button
            label="Confirm"
            className="font-semibold bg-finnieGray-light text-finnieBlue-light w-[240px] h-[48px] mt-4"
            onClick={() => {
              console.log('###match', { phrase, newSeedPhrase });
              if (phrase === newSeedPhrase) {
                navigate(AppRoute.OnboardingPhraseSaveSuccess);
              }
              setError('Seed phrase does not match');
            }}
          />
        </div>
      </div>
    </div>
  );
}
