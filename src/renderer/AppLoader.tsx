import React from 'react';
import { Navigate } from 'react-router-dom';

import { AppRoute } from 'renderer/types/routes';

import { useUserSettings } from './features/common';

function AppLoader(): JSX.Element {
  const { settings, loadingSettings } = useUserSettings();

  if (loadingSettings) return <div>loading...</div>;

  if (settings?.onboardingCompleted) {
    return <Navigate to={AppRoute.Unlock} />;
  }
  return <Navigate to={AppRoute.OnboardingCreatePin} />;
}

export default AppLoader;
