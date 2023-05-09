import { Icon } from '@_koii/koii-styleguide';
import React from 'react';

import KoiiLogo from 'assets/svgs/koii-logo-white.svg';
import WelcomeLinesDiagonal from 'assets/svgs/welcome-lines-diagonal.svg';
import WelcomeWheelBackground from 'assets/svgs/welcome-wheel-background.svg';

type PropsType = {
  initError?: string;
};

export function LoadingScreen({ initError }: PropsType): JSX.Element {
  // TODO(Chris) Use string value of initError?
  return (
    <div className="relative overflow-y-auto flex flex-col justify-center items-center gap-5 h-full bg-gradient-to-b from-finnieBlue-dark-secondary to-finnieBlue text-white overflow-hidden">
      <WelcomeWheelBackground className="absolute top-0 -left-[40%] h-[40%] scale-110" />

      <Icon source={KoiiLogo} className="h-[156px] w-[156px]" />
      <h1 className="text-[40px] leading-[48px] text-center">
        Welcome to the New Internet.
      </h1>
      <p className="text-lg text-center flex justify-center max-w-xl">
        <p>
          <span className="text-finnieTeal mr-1">
            Koii nodes power better apps.
          </span>
          Earn tokens by providing the resources you already have to your
          community.
        </p>
      </p>

      <WelcomeLinesDiagonal className="absolute bottom-0 -right-[22.5%] h-full" />

      {initError ? (
        <div>
          <p className="text-lg text-finnieRed text-center">
            <span>
              Something went wrong.
              <br /> Please restart the Desktop Node
            </span>
          </p>
        </div>
      ) : (
        <div className="w-[226px] h-2 bg-finnieTeal bg-opacity-40 rounded-full">
          <div className="h-full bg-finnieTeal bg-opacity-90 rounded-full progress-bar" />
        </div>
      )}
    </div>
  );
}
