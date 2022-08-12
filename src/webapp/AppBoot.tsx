import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { MainLayout } from './components';
import { AppRoute } from './routing/AppRoutes';
import { getAllAccounts } from './services';

const AppBoot = (): JSX.Element => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllAccounts()
      .then((accounts) => {
        console.log('############### accounts', accounts);
        if (accounts.length === 0) navigate(AppRoute.OnboardingCreatePin);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>App boots...</div>;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export default AppBoot;
