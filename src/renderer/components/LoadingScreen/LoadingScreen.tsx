import { Icon } from '@_koii/koii-styleguide';
import { faWifi3 } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

import KoiiLogo from 'assets/svgs/koii-logo-white.svg';
import WelcomeLinesDiagonal from 'assets/svgs/welcome-lines-diagonal.svg';
import WelcomeWheelBackground from 'assets/svgs/welcome-wheel-background.svg';
import { useInternetConnectionStatus } from 'renderer/features/settings/hooks/useInternetConnectionStatus';

type PropsType = {
  initError?: string;
};

export function LoadingScreen({ initError }: PropsType): JSX.Element {
  const isOnline = useInternetConnectionStatus();

  const getContent = () => {
    if (initError) {
      return (
        <p className="text-lg text-center text-finnieRed">
          <span>
            Something went wrong.
            <br /> Please restart the Koii Node
          </span>
        </p>
      );
    }

    if (!isOnline) {
      return (
        <p className="text-lg text-center text-finnieRed">
          <FontAwesomeIcon icon={faWifi3} className="pr-2" />
          <span>
            No internet connection.
            <br /> Please check your connection or restart the Koii Node
          </span>
        </p>
      );
    }

    return (
      <div className="w-[226px] h-2 bg-finnieTeal bg-opacity-40 rounded-full">
        <div className="h-full rounded-full bg-finnieTeal bg-opacity-90 progress-bar" />
      </div>
    );
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-full gap-5 overflow-hidden overflow-y-auto text-white bg-gradient-to-b from-finnieBlue-dark-secondary to-finnieBlue">
      <WelcomeWheelBackground className="absolute top-0 -left-[40%] h-[40%] scale-110" />

      <Icon source={KoiiLogo} className="h-[156px] w-[156px]" />
      <h1 className="text-[40px] leading-[48px] text-center">
        Welcome to the New Internet.
      </h1>
      <p className="justify-center max-w-xl text-lg text-center">
        <span className="mr-1 text-finnieTeal">
          Koii nodes power better apps.
        </span>
        Earn tokens by providing the resources you already have to your
        community.
      </p>

      <WelcomeLinesDiagonal className="absolute bottom-0 -right-[22.5%] h-full" />

      {getContent()}
    </div>
  );
}
