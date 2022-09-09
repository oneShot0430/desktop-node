import React from 'react';
import { Navigate } from 'react-router-dom';

import { useUserSettings } from './features/common';
import { AppRoute } from './routing/AppRoutes';

const AppLoader = (): JSX.Element => {
  const { settings, loadingSettings } = useUserSettings();

  if (loadingSettings) <div>loading...</div>;

  if (settings?.onboardingCompleted) {
    return <Navigate to={AppRoute.MyNode} />;
  } else {
    return <Navigate to={AppRoute.OnboardingCreatePin} />;
  }
};

export default AppLoader;
