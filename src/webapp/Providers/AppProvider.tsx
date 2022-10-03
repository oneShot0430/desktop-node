import React from 'react';
import { HashRouter } from 'react-router-dom';

const AppProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  return <HashRouter>{children}</HashRouter>;
};

export default AppProvider;
