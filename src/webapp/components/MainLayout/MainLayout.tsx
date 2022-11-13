import React from 'react';
import { useNavigate } from 'react-router-dom';

import { saveUserConfig } from 'webapp/services';
import { AppRoute } from 'webapp/types/routes';

import { BackButton } from '../BackButton';
import Header from '../Header';
import { Sidebar } from '../Sidebar/Sidebar';
import { Button } from '../ui/Button';

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps): JSX.Element => {
  const navigate = useNavigate();

  const resetOnboarding = async () => {
    await saveUserConfig({
      settings: { onboardingCompleted: false },
    });
    navigate(AppRoute.OnboardingCreatePin);
  };

  return (
    <div className="flex flex-col h-full">
      <Header />
      <main className="flex flex-col h-full bg-gradient-to-b from-finnieBlue-dark-secondary to-finnieBlue">
        <div className="px-4 mx-auto w-full flex justify-between">
          <BackButton />
          <Button
            className="mt-4 text-white"
            label="Reset onboarding"
            onClick={resetOnboarding}
          />
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
