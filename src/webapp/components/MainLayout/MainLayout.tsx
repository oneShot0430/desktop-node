import React from 'react';

import Header from 'webapp/components/Header';
import Modal from 'webapp/components/Modal';
import ModalTaskInspect from 'webapp/components/ModalTaskInspector';
import { useAppSelector } from 'webapp/hooks/reduxHook';

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
      <main className="pt-xxl">{children}</main>
    </div>
  );
};

export default MainLayout;
