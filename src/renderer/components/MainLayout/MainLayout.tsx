import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { AppTopBar } from 'renderer/components/AppTopBar';
import { saveUserConfig } from 'renderer/services';
import { AppRoute } from 'renderer/types/routes';

import Header from '../Header';
import { Sidebar } from '../Sidebar';

type MainLayoutProps = {
  children: React.ReactNode;
};

function MainLayout({ children }: MainLayoutProps): JSX.Element {
  const navigate = useNavigate();

  // TODO: Remove after release
  useEffect(() => {
    (window as typeof window & { resetOnboarding(): void }).resetOnboarding =
      async () => {
        await saveUserConfig({
          settings: { onboardingCompleted: false },
        });
        navigate(AppRoute.OnboardingCreatePin);
      };
  }, [navigate]);

  return (
    <div className="flex flex-col flex-grow bg-gradient-to-b from-finnieBlue-dark-secondary to-finnieBlue h-screen min-h-0">
      <Header />
      <AppTopBar />
      <div className="flex flex-grow min-h-0 px-4">
        <Sidebar />
        <div className="flex flex-col flex-grow min-h-0 pb-4">{children}</div>
      </div>
    </div>
  );
}

export default MainLayout;
