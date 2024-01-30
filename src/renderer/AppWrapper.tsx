import React, { useEffect, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { MainLayout } from './components';
import { useLowStakingAccountBalanceWarnings } from './features';
import { useAppNotifications } from './features/notifications/hooks/useAppNotifications';
import { OnboardingLayout } from './features/onboarding/components/OnboardingLayout';
import { OnboardingProvider } from './features/onboarding/context/onboarding-context';
import { StartingTasksProvider, MyNodeProvider } from './features/tasks';

function AppWrapper(): JSX.Element {
  const { addAppNotification: showCriticalStakingKeyBalanceNotification } =
    useAppNotifications('TOP_UP_STAKING_KEY_CRITICAL');
  const { addAppNotification: addUpdateAvailableNotification } =
    useAppNotifications('UPDATE_AVAILABLE');

  useLowStakingAccountBalanceWarnings({
    showCriticalBalanceNotification: showCriticalStakingKeyBalanceNotification,
  });
  const location = useLocation();

  const isOnboarding = useMemo(
    () => location.pathname.includes('onboarding'),
    [location]
  );

  useEffect(() => {
    const destroy = window.main.onAppUpdate(() => {
      addUpdateAvailableNotification();
    });

    return () => {
      destroy();
    };
  }, [addUpdateAvailableNotification]);

  if (!isOnboarding) {
    return (
      <StartingTasksProvider>
        <MyNodeProvider>
          <MainLayout>
            <Outlet />
          </MainLayout>
        </MyNodeProvider>
      </StartingTasksProvider>
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
