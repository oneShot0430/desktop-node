import React from 'react';

import Header from 'webapp/components/Header';

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps): JSX.Element => {
  return (
    <div>
      <Header />
      <main className="pt-xxl">{children}</main>
    </div>
  );
};

export default MainLayout;
