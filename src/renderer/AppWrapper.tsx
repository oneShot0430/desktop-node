import React, { useEffect, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { MainLayout } from './components';
import { useLowStakingAccountBalanceWarnings } from './features';
import {
  AppNotification,
  useNotificationsContext,
  NotificationPlacement,
} from './features/notifications';
import { OnboardingLayout } from './features/onboarding/components/OnboardingLayout';
import { OnboardingProvider } from './features/onboarding/context/onboarding-context';
import { StartingTasksProvider, MyNodeProvider } from './features/tasks';

function AppWrapper(): JSX.Element {
  const { addNotification } = useNotificationsContext();

  useLowStakingAccountBalanceWarnings();
  const location = useLocation();

  const isOnboarding = useMemo(
    () => location.pathname.includes('onboarding'),
    [location]
  );

  useEffect(() => {
    const destroy = window.main.onAppUpdate(() => {
      addNotification(
        'updateAvailable',
        AppNotification.UpdateAvailable,
        NotificationPlacement.TopBar
      );
    });

    return () => {
      destroy();
    };
  }, [addNotification]);

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
