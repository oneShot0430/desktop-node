import React from 'react';

import FinnieLogo from 'svgs/finnie-logos/finnie-logo.svg';

import Navbar from './Navbar';

const Header = (): JSX.Element => {
  return (
    <header className="z-10 flex items-center justify-between w-screen pr-8 text-white h-xxl bg-finnieBlue-light">
      <div className="relative pl-4">
        <FinnieLogo className="h-xxl" />
      </div>
      <Navbar />
    </header>
  );
};

export default Header;
