import { compare } from 'bcryptjs';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import KoiiLogo from 'assets/svgs/koii-logo-white.svg';
import WelcomeLinesDiagonal from 'assets/svgs/welcome-lines-diagonal.svg';
import WelcomeWheelBackground from 'assets/svgs/welcome-wheel-background.svg';
import { PinInput } from 'webapp/components/PinInput';
import { useUserSettings } from 'webapp/features/common';
import { AppRoute } from 'webapp/types/routes';

export const Unlock = (): JSX.Element => {
  const [hasPinError, setHasPinError] = useState<boolean>(false);

  const { settings } = useUserSettings();

  const navigate = useNavigate();

  const handlePinChange = async (enteredPin: string) => {
    setHasPinError(false);
    const finishedTypingPin = enteredPin.length === 6;

    if (finishedTypingPin) {
      const pinMatchesStoredHash = await compare(enteredPin, settings.pin);

      if (pinMatchesStoredHash) {
        navigate(AppRoute.MyNode);
      } else {
        setHasPinError(true);
      }
    }
  };

  return (
    <div className="relative h-full overflow-y-auto flex flex-col justify-center items-center gap-5 h-full bg-gradient-to-b from-finnieBlue-dark-secondary to-finnieBlue text-white">
      <WelcomeWheelBackground className="absolute top-0 left-0 h-[40%]" />

      <KoiiLogo />
      <h1 className="text-[40px] leading-[48px] text-center">
        Welcome to the Koii Node
      </h1>
      <p className="text-lg text-center">
        Enter your security PIN code to unlock your Node
      </p>

      <PinInput onChange={handlePinChange} showHideButton={false} />
      <div className="text-xs text-finnieOrange h-4">
        {hasPinError && <span>The PINs don’t match. Let’s try again.</span>}
      </div>

      <WelcomeLinesDiagonal className="absolute bottom-0 right-0 h-full" />
    </div>
  );
};
