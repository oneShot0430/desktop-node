import React from 'react';
import { useNavigate } from 'react-router-dom';

import KoiiLogo from 'assets/svgs/koii-logo-white.svg';
import WelcomeLinesDiagonal from 'assets/svgs/welcome-lines-diagonal.svg';
import WelcomeWheelBackground from 'assets/svgs/welcome-wheel-background.svg';
import { PinInput } from 'webapp/components/PinInput';
import { useUserSettings } from 'webapp/features/common';
import { AppRoute } from 'webapp/routing/AppRoutes';

export const Unlock = (): JSX.Element => {
  const {
    settings: { pin: storedPin },
  } = useUserSettings();

  const navigate = useNavigate();

  console.log('storedPin: ', storedPin);

  const handlePinChange = (pin: string) => {
    const finishedTypingPin = pin.length === 6;

    if (finishedTypingPin) {
      console.log('verify pin: ', pin);
      const pinsMatch = pin === storedPin;

      if (pinsMatch) {
        navigate(AppRoute.MyNode);
      }
    }
  };

  return (
    <div className="relative h-full overflow-y-auto flex flex-col justify-center items-center gap-5 h-full bg-gradient-to-b from-finnieBlue-dark-secondary to-finnieBlue text-white">
      <WelcomeWheelBackground className="absolute top-0 left-0 h-[40%]" />
      <KoiiLogo className="" />
      <h1 className="text-[40px] leading-[48px] text-center">
        Welcome to the Koii Node
      </h1>
      <p className="text-lg text-center">
        Enter your security PIN code to unlock your Node
      </p>

      <PinInput onChange={handlePinChange} showHideButton={false} />

      <WelcomeLinesDiagonal className="absolute bottom-0 right-0 h-full" />
    </div>
  );
};
