import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import YellowLinesTop from 'assets/svgs/onboarding/key-import-lines-top.svg';
import TealLinesBottom from 'assets/svgs/onboarding/key-import-teal-lines-bot.svg';

const CreateOrImportAccountWrapper = () => {
  const location = useLocation();
  const showBgShapes = !location.pathname.includes('backup');

  return (
    <div className="relative h-full overflow-hidden bg-finnieBlue-dark-secondary">
      <div className="z-20 w-full h-full">
        <Outlet />
      </div>
      {showBgShapes && (
        <>
          <YellowLinesTop className="absolute top-0 right-0 z-0" />
          <TealLinesBottom className="absolute bottom-0 left-0" />
        </>
      )}
    </div>
  );
};

export default CreateOrImportAccountWrapper;
