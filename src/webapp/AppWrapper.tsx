import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { MainLayout } from './components';
import { OnboardingLayout } from './components/layouts/OnboardingLayout';
import { OnboardingProvider } from './components/onboarding/context/onboarding-context';

const AppWrapper = (): JSX.Element => {
  const location = useLocation();
  const isOnbaording = location.pathname.includes('onboarding');

  if (!isOnbaording) {
    return (
      <MainLayout>
        <Outlet />
      </MainLayout>
    );
  } else {
    return (
      <OnboardingProvider>
        <OnboardingLayout>
          <Outlet />
        </OnboardingLayout>
      </OnboardingProvider>
    );
  }
};

export default AppWrapper;
