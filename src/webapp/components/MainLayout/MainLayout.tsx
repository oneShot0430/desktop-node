import React from 'react';

import Header from 'webapp/components/Header';
import Modal from 'webapp/components/Modal';
import ModalTaskInspect from 'webapp/components/ModalTaskInspector';
import { useAppSelector } from 'webapp/hooks/reduxHook';

import { BackButton } from '../BackButton/BackButton';
import { Sidebar } from '../Sidebar/Sidebar';

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps): JSX.Element => {
  const showTaskInspector = useAppSelector(
    (state) => state.taskInspector.isShown
  );

  window.main.mainAccountPubKey().then(console.log);
  // window.main
  //   .checkWalletExists({
  //     taskId: 'sample-task-id',
  //   })
  //   .then(console.log);

  // window.main
  //   .storeMainWallet({
  //     walletPath: '/Users/raj/fresh-pull/desktop-node/id.json',
  //   })
  //   .then(console.log);

  return (
    <div>
      <Modal />
      {showTaskInspector && <ModalTaskInspect />}
      <Header />
      <main className="pt-[64px] min-h-screen bg-gradient-to-b from-finnieBlue-dark-secondary to-finnieBlue">
        <div className="px-4 mx-auto">
          <BackButton />
          <div className="flex">
            <Sidebar />
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
