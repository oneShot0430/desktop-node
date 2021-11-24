import React from 'react';

import Header from 'webapp/components/Header';
import Modal from 'webapp/components/Modal';

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps): JSX.Element => {
  return (
    <div>
      <Modal />
      <Header />
      <main className="pt-xxl">{children}</main>
    </div>
  );
};

export default MainLayout;
