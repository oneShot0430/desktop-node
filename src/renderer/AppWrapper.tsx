import React, { useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { Outlet, useLocation } from 'react-router-dom';

import { MainLayout, LoadingScreen } from './components';
import { OnboardingLayout } from './features/onboarding/components/OnboardingLayout';
import { OnboardingProvider } from './features/onboarding/context/onboarding-context';
import {
  QueryKeys,
  getAllAccounts,
  getUserConfig,
  initializeTasks,
} from './services';

function AppWrapper(): JSX.Element {
  const queryClient = useQueryClient();
  const location = useLocation();

  const isOnboarding = useMemo(
    () => location.pathname.includes('onboarding'),
    [location]
  );

  const { isLoading: initializingNode, error } = useQuery(
    [QueryKeys.NodeInitialized],
    () => initializeTasks()
  );

  // started prefetching required data while node is initialising
  useEffect(() => {
    const prefetchQueries = async () => {
      await Promise.all([
        queryClient.prefetchQuery({
          queryKey: [QueryKeys.UserSettings],
          queryFn: getUserConfig,
        }),
        queryClient.prefetchQuery({
          queryKey: [QueryKeys.Accounts],
          queryFn: getAllAccounts,
        }),
      ]);
    };

    prefetchQueries();
  }, [queryClient]);

  if (error) {
    return <LoadingScreen initError={error as string} />;
  }

  if (initializingNode) {
    return <LoadingScreen />;
  }

  if (!isOnboarding) {
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
