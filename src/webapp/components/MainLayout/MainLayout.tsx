import React from 'react';

import Header from 'webapp/components/Header';
import Modal from 'webapp/components/Modal';
import ModalTaskInspect from 'webapp/components/ModalTaskInspector';
import { useAppSelector } from 'webapp/hooks/reduxHook';

import { BackButton } from '../BackButton';
import PrimitiveOnboarding from '../PrimitiveOnboarding';
import { Sidebar } from '../Sidebar/Sidebar';

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps): JSX.Element => {
  const showTaskInspector = useAppSelector(
    (state) => state.taskInspector.isShown
  );
  window.main.createStakingWallet().then(console.log);
  return (
    <div>
      <Modal />
      {showTaskInspector && <ModalTaskInspect />}
      <Header />
      <main className="pt-[64px] min-h-screen bg-gradient-to-b from-finnieBlue-dark-secondary to-finnieBlue flex flex-col ">
        <div className="px-4 mx-auto w-[100%] flex justify-between">
          <BackButton />
          <PrimitiveOnboarding />
        </div>
        <div className="px-4 mx-auto main-bg h-[100%] pb-[24px] pt-3 w-[100%] flex-grow">
          <div className="flex">
            <Sidebar />
            <div className="w-[100%]">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
