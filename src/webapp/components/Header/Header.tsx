import React from 'react';

import FinnieLogo from 'src/assets/finnie-logo.svg';

import Navbar from './Navbar';

const Header = (): JSX.Element => {
  return (
    <header className="fixed w-screen h-xxl flex items-center justify-between pr-8 text-white bg-gradient-to-r from-finnieBlue-dark to-finnieBlue-light">
      <FinnieLogo />
      <Navbar />
    </header>
  );
};

export default Header;
