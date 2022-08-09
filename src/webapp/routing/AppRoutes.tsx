import React, { useEffect } from 'react';
import { useRoutes, Outlet, useNavigate } from 'react-router-dom';

import { OnboardingLayout } from 'webapp/components/layouts/OnboardingLayout';
import {
  CreatePin,
  FundNewKey,
  RunFirstTask,
  ConfirmYourStake,
} from 'webapp/components/onboarding';

import { History, MainLayout, Settings, AddTasks, MyNode } from '../components';

export enum AppRoute {
  Root = '/',
  MyNode = '/my-node',
  Rewards = '/rewards',
  AddTask = '/add-tasks',
  Notifications = '/notifications',
  Settings = '/settings',
  History = '/history',
  Onboarding = '/onboarding',
  // onboarding routes
  OnboardingCreatePin = '/onboarding/create-pin',
  OnboardingCreateOrImportKey = '/onboarding/create-or-import-key',
  OnboardingCreateFirstTask = '/onboarding/create-first-task',
  OnboardingConfirmStake = '/onboarding/confirm-stake',
}

function isOnBoardingCompleted() {
  return false;
}

const Onboarding = () => {
  return (
    <OnboardingLayout>
      <Outlet />
    </OnboardingLayout>
  );
};

const Wrapper = (): JSX.Element => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOnBoardingCompleted()) {
      navigate(AppRoute.OnboardingCreatePin);
    }
  }, []);

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

const routes = [
  {
    path: AppRoute.Onboarding,
    element: <Onboarding />,
    children: [
      {
        path: AppRoute.OnboardingCreatePin,
        element: <CreatePin />,
      },
      {
        path: AppRoute.OnboardingCreateOrImportKey,
        element: <FundNewKey />,
      },
      {
        path: AppRoute.OnboardingCreateFirstTask,
        element: <RunFirstTask />,
      },
      {
        path: AppRoute.OnboardingConfirmStake,
        element: <ConfirmYourStake />,
      },
    ],
  },
  {
    path: AppRoute.Root,
    element: <Wrapper />,
    children: [
      { path: AppRoute.MyNode, element: <MyNode /> },
      {
        path: AppRoute.AddTask,
        element: <AddTasks />,
      },
      {
        path: AppRoute.Rewards,
        element: (
          <div className="w-1/2 mx-auto mt-56 text-3xl text-center">
            Rewards
          </div>
        ),
      },
      {
        path: AppRoute.Notifications,
        element: (
          <div className="w-1/2 mx-auto mt-56 text-3xl text-center">
            Notifications
          </div>
        ),
      },
      {
        path: AppRoute.History,
        element: <History />,
      },
      {
        path: AppRoute.Settings,
        element: <Settings />,
      },
      { path: AppRoute.Root, element: <MyNode /> },
    ],
  },
];

const AppRoutes = (): JSX.Element => {
  return useRoutes(routes);
};

export default AppRoutes;
