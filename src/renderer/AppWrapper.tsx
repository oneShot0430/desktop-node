import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { MainLayout } from './components';
import { OnboardingLayout } from './features/onboarding/components/OnboardingLayout';
import { OnboardingProvider } from './features/onboarding/context/onboarding-context';

function AppWrapper(): JSX.Element {
  const location = useLocation();
  const isOnbaording = location.pathname.includes('onboarding');

  if (!isOnbaording) {
    return (
      <MainLayout>
        <Outlet />
      </MainLayout>
    );
  }
  return (
    <OnboardingProvider>
      <OnboardingLayout>
        <Outlet />
      </OnboardingLayout>
    </OnboardingProvider>
  );
}

export default AppWrapper;
