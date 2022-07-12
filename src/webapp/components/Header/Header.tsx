import React from 'react';

import FinnieLogo from 'svgs/finnie-logos/finnie-logo.svg';

import Navbar from './Navbar';

const Header = (): JSX.Element => {
  return (
    <header className=" w-[100%] z-10 sticky flex items-center justify-between pr-8 text-white h-xxl bg-finnieBlue-light">
      <div className="relative pl-4">
        <FinnieLogo className="h-xxl" />
      </div>
      <Navbar />
    </header>
  );
};

export default Header;
