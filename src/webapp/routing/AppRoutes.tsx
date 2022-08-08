import React, { useEffect } from 'react';
import { useRoutes, Outlet, useNavigate } from 'react-router-dom';

import { History, MainLayout, Settings, AddTasks, MyNode } from '../components';

export enum AppRoute {
  Root = '/',
  MyNode = '/my-node',
  Rewards = '/rewards',
  AddTask = '/add-tasks',
  Notifications = '/notifications',
  Settings = '/settings',
  History = '/history',
}

function isOnBoardingCompleted() {
  return false;
}

const Wrapper = (): JSX.Element => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOnBoardingCompleted()) {
      navigate('/onboarding');
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
    path: '/onboarding',
    element: (
      <div>
        <h1>Onboarding</h1>
      </div>
    ),
    children: [
      {
        path: 'onboarding/create-pin',
        element: <div>welcome</div>,
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
