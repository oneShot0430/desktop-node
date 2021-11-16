import React from 'react';

import FinnieLogo from 'src/assets/finnie-logo.svg';
import HeaderBackground from 'src/assets/header-background.svg';

import Navbar from './Navbar';

const Header = (): JSX.Element => {
  return (
    <header className="fixed w-screen h-xxl flex items-center justify-between pr-8 text-white bg-gradient-to-r from-finnieBlue-dark to-finnieBlue-light">
      <div className="relative">
        <FinnieLogo />
        <HeaderBackground className="absolute top-0" />
      </div>
      <Navbar />
    </header>
  );
};

export default Header;
