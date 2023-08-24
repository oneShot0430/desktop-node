import React, { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from 'react-query';
import { Outlet, useLocation } from 'react-router-dom';

import { MainLayout, LoadingScreen } from './components';
import {
  AppNotification,
  useNotificationsContext,
  NotificationPlacement,
} from './features/notifications';
import { OnboardingLayout } from './features/onboarding/components/OnboardingLayout';
import { OnboardingProvider } from './features/onboarding/context/onboarding-context';
import { StartingTasksProvider, MyNodeProvider } from './features/tasks';
import {
  QueryKeys,
  getAllAccounts,
  getUserConfig,
  initializeTasks,
} from './services';
import { getErrorToDisplay } from './utils';

const NODE_INITIALIZED = 'NODE_INITIALIZED';

function AppWrapper(): JSX.Element {
  const { addNotification } = useNotificationsContext();

  const queryClient = useQueryClient();
  const location = useLocation();
  const [initializingNode, setInitializingNode] = useState(true);
  const [initError, setInitError] = useState<string | undefined>(undefined);

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

  useEffect(() => {
    const setValue = 'true';

    const initializeNode = async () => {
      try {
        // Indicate the initialization API call in sessionStorage
        sessionStorage.setItem(NODE_INITIALIZED, setValue);
        await initializeTasks();
      } catch (error: any) {
        console.error(error);
        setInitError(getErrorToDisplay(error));
      } finally {
        setInitializingNode(false);
      }
    };

    // Check if the node was already initialized
    const nodeInitialized = sessionStorage.getItem(NODE_INITIALIZED);

    if (nodeInitialized !== setValue) {
      initializeNode();
    } else {
      setInitializingNode(false);
    }
  }, []);

  // started prefetching required data while node is initialising
  useEffect(() => {
    const prefetchQueries = async () => {
      try {
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
      } catch (error: any) {
        console.error(error);
        setInitError(getErrorToDisplay(error));
      }
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
