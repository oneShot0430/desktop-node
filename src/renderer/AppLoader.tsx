import React from 'react';
import { Navigate } from 'react-router-dom';

import { LoadingSpinner } from 'renderer/components';
import { AppRoute } from 'renderer/types/routes';

import { useUserSettings } from './features/common';

function AppLoader(): JSX.Element {
  const { settings, loadingSettings } = useUserSettings();

  const routeToNavigate = settings?.onboardingCompleted
    ? AppRoute.Unlock
    : AppRoute.OnboardingCreatePin;

  if (loadingSettings) return <LoadingSpinner className="m-auto" />;

  return <Navigate to={routeToNavigate} />;
}

export default AppLoader;
