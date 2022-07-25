import React from 'react';

import Header from 'webapp/components/Header';
import { Modal } from 'webapp/components/Modals';
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
  // window.main
  //   .storeMainWallet({
  //     walletPath: '/Users/raj/fresh-pull/desktop-node/id.json',
  //   })
  //   .then(() => {
  //     window.main
  //       .claimReward({
  //         taskAccountPubKey: '5iE4xR7nXHUfZ7UimQRrAHYoL8d2aNFiXULhEHrmW3Pp',
  //       })
  //       .then(console.log);
  //   });

  return (
    <div className="">
      <Modal />
      {showTaskInspector && <ModalTaskInspect />}
      <Header />
      <main className="flex flex-col h-[calc(100vh-62px)] bg-gradient-to-b from-finnieBlue-dark-secondary to-finnieBlue">
        <div className="px-4 mx-auto w-[100%] flex justify-between">
          <BackButton />
          <PrimitiveOnboarding />
        </div>
        <div className="px-4 mx-auto main-bg h-[100%] pt-3 w-[100%] flex-grow">
          <div className="flex items-stretch h-[100%] pb-4">
            <Sidebar />
            <div className="w-[100%] ">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
