import React from 'react';
import { Navigate } from 'react-router-dom';

import { AppRoute } from 'webapp/types/routes';

import { useUserSettings } from './features/common';

const AppLoader = (): JSX.Element => {
  const { settings, loadingSettings } = useUserSettings();

  if (loadingSettings) <div>loading...</div>;

  if (settings?.onboardingCompleted) {
    return <Navigate to={AppRoute.Unlock} />;
  } else {
    return <Navigate to={AppRoute.OnboardingCreatePin} />;
  }
};

export default AppLoader;
