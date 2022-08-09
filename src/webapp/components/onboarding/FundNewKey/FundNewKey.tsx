import React from 'react';
import { Outlet } from 'react-router-dom';

import YellowLinesTop from 'assets/svgs/onboarding/key-import-lines-top.svg';
import TealLinesBottom from 'assets/svgs/onboarding/key-import-teal-lines-bot.svg';

const FundNewKey = () => {
  return (
    <div className="relative h-full overflow-hidden bg-finnieBlue-dark-secondary">
      <Outlet />
      <YellowLinesTop className="absolute top-0 right-0" />
      <TealLinesBottom className="absolute bottom-0 left-[-180px]" />
    </div>
  );
};

export default FundNewKey;
