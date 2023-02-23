import React from 'react';

import { ReactComponent as FinnieLogo } from 'assets/svgs/finnie-logos/finnie-logo.svg';

import Navbar from './Navbar';

function Header(): JSX.Element {
  return (
    <header className="w-full z-10 sticky flex items-center justify-between pr-8 text-white h-xxl bg-finnieBlue-light">
      <div className="relative pl-4">
        <FinnieLogo className="h-xxl" />
      </div>
      <Navbar />
    </header>
  );
}

export default Header;
