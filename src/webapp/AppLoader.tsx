import React from 'react';
import { Navigate } from 'react-router-dom';

import { LoadingSpinner } from 'webapp/components';
import { useUserSettings } from 'webapp/features/common';
import { AppRoute } from 'webapp/types/routes';

const AppLoader = (): JSX.Element => {
  const { settings, loadingSettings } = useUserSettings();

  const routeToNavigate = !settings?.onboardingCompleted
    ? AppRoute.Unlock
    : AppRoute.OnboardingCreatePin;

  if (loadingSettings) return <LoadingSpinner className="m-auto" />;

  return <Navigate to={routeToNavigate} />;
};

export default AppLoader;
