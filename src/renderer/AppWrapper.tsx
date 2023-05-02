import React, { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from 'react-query';
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
import { getErrorToDisplay } from './utils';

const NODE_INITALIZED = 'NODE_INITALIZED';

function AppWrapper(): JSX.Element {
  const queryClient = useQueryClient();
  const location = useLocation();
  const [initializingNode, setInitializingNode] = useState(true);
  const [initError, setInitError] = useState<string | undefined>(undefined);

  const isOnboarding = useMemo(
    () => location.pathname.includes('onboarding'),
    [location]
  );

  useEffect(() => {
    const setValue = 'true';

    const initializeNode = async () => {
      try {
        await initializeTasks();
        // Save the initialized state in sessionStorage
        sessionStorage.setItem(NODE_INITALIZED, setValue);
      } catch (error: any) {
        console.error(error);
        setInitError(getErrorToDisplay(error));
      } finally {
        setInitializingNode(false);
      }
    };

    // Check if the node was already initialized
    const nodeInitialized = sessionStorage.getItem(NODE_INITALIZED);

    if (nodeInitialized !== setValue) {
      initializeNode();
    } else {
      setInitializingNode(false);
    }
  }, []);

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

  if (initError) {
    return <LoadingScreen initError={initError as string} />;
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
