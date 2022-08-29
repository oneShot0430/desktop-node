import React from 'react';
import { useQuery } from 'react-query';
import { Navigate } from 'react-router-dom';

import { AppRoute } from './routing/AppRoutes';
import { QueryKeys, getUserConfig } from './services';

const AppLoader = (): JSX.Element => {
  const { data: settings, isLoading } = useQuery(
    QueryKeys.UserSettings,
    getUserConfig
  );

  if (isLoading) <div>loading...</div>;

  if (settings?.onboardingCompleted) {
    return <Navigate to={AppRoute.MyNode} />;
  } else {
    return <Navigate to={AppRoute.OnboardingCreatePin} />;
  }
};

export default AppLoader;
