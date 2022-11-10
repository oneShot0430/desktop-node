import React from 'react';

import WelcomeLinesDiagonal from 'assets/svgs/welcome-lines-diagonal.svg';
import WelcomeWheelBackground from 'assets/svgs/welcome-wheel-background.svg';

export const Unlock = (): JSX.Element => {
  return (
    <div className="relative h-full overflow-y-auto flex flex-col justify-center items-center gap-5 h-full bg-gradient-to-b from-finnieBlue-dark-secondary to-finnieBlue text-white">
      <WelcomeWheelBackground className="absolute top-0 left-0 h-[40%]" />

      <WelcomeLinesDiagonal className="absolute bottom-0 right-0 h-full" />
    </div>
  );
};
