import React from 'react';
import { useNavigate } from 'react-router-dom';

import Header from 'webapp/components/Header';
import { Modal } from 'webapp/components/Modals';
import ModalTaskInspect from 'webapp/components/ModalTaskInspector';
import { useAppSelector } from 'webapp/hooks/reduxHook';
import { AppRoute } from 'webapp/routing/AppRoutes';
import { saveUserConfig } from 'webapp/services';

import { BackButton } from '../BackButton';
import { Sidebar } from '../Sidebar/Sidebar';
import { Button } from '../ui/Button';

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps): JSX.Element => {
  const showTaskInspector = useAppSelector(
    (state) => state.taskInspector.isShown
  );
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full">
      <Modal />
      {showTaskInspector && <ModalTaskInspect />}
      <Header />
      <main className="flex flex-col h-full bg-gradient-to-b from-finnieBlue-dark-secondary to-finnieBlue">
        <div className="px-4 mx-auto w-[100%] flex justify-between">
          <BackButton />
          <Button
            className="mt-4"
            label="Reset onboarding"
            onClick={async () => {
              await saveUserConfig({
                settings: { onboardingCompleted: false },
              });
              navigate(AppRoute.OnboardingCreatePin);
            }}
          />
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
