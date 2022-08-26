import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import WarningIcon from 'assets/svgs/onboarding/warning-icon.svg';
import { ShowSeedPhrase } from 'webapp/components/ShowSeedPhrase';
import { Button } from 'webapp/components/ui/Button';
import { AppRoute } from 'webapp/routing/AppRoutes';

import { OnboardingContext } from '../context/onboarding-context';

export const BackupKeyNow = () => {
  const { newSeedPhrase } = useContext(OnboardingContext);
  const navigate = useNavigate();
  const [phraseRevealed, setPhraseRevealed] = useState(false);
  const handlePhraseReveal = () => {
    setPhraseRevealed(true);
  };

  const handleConfirmClick = () => {
    const skipThisStep = !phraseRevealed;

    if (skipThisStep) {
      navigate(AppRoute.MyNode);
    } else {
      navigate(AppRoute.OnboardingConfirmSecretPhrase);
    }
  };

  return (
    <div className="px-[105px] flex flex-col items-center w-full mt-[70px]">
      <div className="w-full mb-4 text-2xl font-semibold">
        Back up your Secret Phrase
      </div>
      <div className="w-full mb-4 ">
        This secret phrase gives you access to your key and allows you to import
        it on any device. Make sure to keep your secret phrase in a safe spot.
      </div>

      <div className="w-full mb-4 ">
        Keep this phrase off any internet-connected devices and never share it
        with anyone!
      </div>

      <div className="flex justify-start w-full mb-4">
        <ShowSeedPhrase
          seedPhrase={newSeedPhrase}
          onPhraseReveal={handlePhraseReveal}
        />
      </div>

      <div className="flex flex-row items-center w-full gap-4 mb-4 text-sm text-finnieOrange">
        <WarningIcon />
        <div>
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
  );
};
