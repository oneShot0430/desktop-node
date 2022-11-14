import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { saveUserConfig } from 'webapp/services';
import { AppRoute } from 'webapp/types/routes';

import { BackButton } from '../BackButton';
import Header from '../Header';
import { Sidebar } from '../Sidebar';

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps): JSX.Element => {
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
    <div className="flex flex-col h-full">
      <Header />
      <main className="flex flex-col h-full bg-gradient-to-b from-finnieBlue-dark-secondary to-finnieBlue">
        <div className="px-4 mx-auto w-full flex justify-between">
          <BackButton />
        </div>
        <div className="px-4 mx-auto main-bg h-full pt-3 w-full flex-grow">
          <div className="flex items-stretch h-full pb-4">
            <Sidebar />
            <div className="w-full">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
