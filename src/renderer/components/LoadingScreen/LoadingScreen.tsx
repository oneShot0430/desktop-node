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

  const facts = [
    {
      bold: 'Koii nodes power better apps.',
      normal:
        ' Earn tokens by providing the resources you already have to your community.',
    },
    {
      bold: 'KOII is a Layer 1 currency, like Ethereum and Solana.',
      normal:
        ' Explore the wide range of possibilities and Layer 2 tokens with our application.',
    },
    {
      bold: 'Koii Network was founded in 2020,',
      normal:
        ' and it is the only live fork of Solana and one of the original projects in the Cryptocurrency space.',
    },
    {
      bold: 'Thanks for joining our Testnet!',
      normal:
        ' All the tokens that you are acquiring will be converted to Mainnet tokens with 1:1 ratio.',
    },
    {
      bold: 'Koii has more than 40 thousands users as of today,',
      normal: ' thanks for being an early adaptor!',
    },
    {
      bold: 'Did you know that KOII stands for Knowledgeable, Open and Infinite Internet?',
      normal: '',
    },
    {
      bold: 'We are planning to launch our mainnet within 2024.',
      normal: ' Stay tuned!',
    },
    {
      bold: 'Did you know that there are only 10 billion initial KOII tokens in existence?',
      normal: ' Obtain yours today during our airdrop phase.',
    },
    {
      bold: 'ROE, which means a "fish egg" is the smallest unit of KOII,',
      normal: ' being equivalent to (1/1000000000) of a KOII.',
    },
    {
      bold: 'You can apply for development grants on our website.',
      normal: ' Help to build a more decentralized world!',
    },
  ];

  const randomFact = facts[Math.floor(Math.random() * facts.length)];

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
          <strong>{randomFact.bold}</strong>
          {randomFact.normal}
        </span>
      </p>

      <WelcomeLinesDiagonal className="absolute bottom-0 -right-[22.5%] h-full" />

      {getContent()}
    </div>
  );
}
