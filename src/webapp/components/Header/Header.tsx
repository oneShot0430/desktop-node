import React from 'react';

import FinnieLogo from 'src/assets/finnie-logo.svg';

const Header = (): JSX.Element => {
  return (
    <header className="fixed w-screen h-xxl flex items-center justify-starto text-white bg-gradient-to-r from-finnieBlue-dark to-finnieBlue-light">
      <FinnieLogo />
      This is the header
    </header>
  );
};

export default Header;
