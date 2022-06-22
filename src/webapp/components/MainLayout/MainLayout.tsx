import React from 'react';

import Header from 'webapp/components/Header';
import Modal from 'webapp/components/Modal';
import ModalTaskInspect from 'webapp/components/ModalTaskInspector';
import { useAppSelector } from 'webapp/hooks/reduxHook';

import { BackButton } from '../BackButton/BackButton';

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps): JSX.Element => {
  const showTaskInspector = useAppSelector(
    (state) => state.taskInspector.isShown
  );

  return (
    <div>
      <Modal />
      {showTaskInspector && <ModalTaskInspect />}
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-finnieBlue-dark-secondary to-finnieBlue">
        <BackButton />
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
