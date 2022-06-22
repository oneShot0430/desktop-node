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
      <main className="pt-[72px] min-h-screen bg-gradient-to-b from-finnieBlue-dark-secondary to-finnieBlue">
        <div className="px-4 mx-auto">
          <BackButton />
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
