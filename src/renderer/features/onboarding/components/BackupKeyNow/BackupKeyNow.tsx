import { WarningCircleLine, Icon } from '@_koii/koii-styleguide';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ShowSeedPhrase } from 'renderer/components/ShowSeedPhrase';
import { Button } from 'renderer/components/ui/Button';
import { useFundNewAccountModal } from 'renderer/features/common';
import { AppRoute } from 'renderer/types/routes';

import { useOnboardingContext } from '../../context/onboarding-context';

export function BackupKeyNow() {
  const { newSeedPhrase } = useOnboardingContext();
  const navigate = useNavigate();
  const [phraseRevealed, setPhraseRevealed] = useState(false);
  const handlePhraseReveal = () => {
    setPhraseRevealed(true);
  };

  const { showModal } = useFundNewAccountModal();

  const handleSkip = () => {
    showModal().then(() => {
      navigate(AppRoute.OnboardingSeeBalance);
    });
  };

  const handleConfirmClick = () => {
    const skipThisStep = !phraseRevealed;

    if (skipThisStep) {
      handleSkip();
    } else {
      navigate(AppRoute.OnboardingConfirmSecretPhrase);
    }
  };

  return (
    <div className="pl-[12vw] pt-[70px]">
      <div className="flex flex-col items-center max-w-[492px]">
        <div className="w-full mb-4 text-2xl font-semibold">
          Back up your Secret Phrase
        </div>
        <div className="w-full mb-4">
          This secret phrase gives you access to your key and allows you to
          import it on any device. Make sure to keep your secret phrase in a
          safe spot.
        </div>

        <div className="w-full mb-4 ">
          Keep this phrase off any internet-connected devices and never share it
          with anyone!
        </div>

        <div className="flex justify-start w-full mb-4">
          <ShowSeedPhrase
            seedPhrase={newSeedPhrase as string}
            onPhraseReveal={handlePhraseReveal}
          />
        </div>

        <div className="flex flex-row items-center w-full gap-4 mb-4 text-sm text-finnieOrange">
          <Icon source={WarningCircleLine} className="h-9 w-9 m-2" />
          <div className="text-sm leading-6">
            <p>Write down your secret phrase on a piece of</p>
            <p>paper and put it in a safe location.</p>
          </div>
        </div>

        <Button
          label={phraseRevealed ? "I'm ready" : 'Skip this step'}
          className="font-semibold bg-finnieGray-light text-finnieBlue-light w-[240px] h-[48px]"
          onClick={handleConfirmClick}
        />
      </div>
    </div>
  );
}
