import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SeedPhraseConfirm } from 'webapp/components/SeedPhraseConfirm/SeedPhraseConfirm';
import { Button } from 'webapp/components/ui/Button';
import { AppRoute } from 'webapp/routing/AppRoutes';

import { OnboardingContext } from '../../context/onboarding-context';

export const ConfirmSecretPhrase = () => {
  const { newSeedPhrase } = useContext(OnboardingContext);
  const [phrase, setPhrase] = useState('');
  const [error, setError] = useState<string>(null);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col pl-[105px] pt-[160px]">
      <div className="w-full mb-4">Confirm your Secret Phrase</div>
      <div className="w-full mb-4">
        Type in the missing words to confirm your secret phrase is secured.
      </div>
      <SeedPhraseConfirm
        seedPhraseValue={newSeedPhrase}
        onPhraseChange={(seedPhrase) => {
          setPhrase(seedPhrase);
        }}
        error={error}
      />

      <div className="absolute bottom-16 left-56">
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
  );
};
