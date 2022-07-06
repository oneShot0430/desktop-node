import React from 'react';
import { useRoutes, Outlet } from 'react-router-dom';

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

const Wrapper = (): JSX.Element => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);

const routes = [
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
