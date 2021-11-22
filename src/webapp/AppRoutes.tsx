import React from 'react';
import { useRoutes, Outlet } from 'react-router-dom';

import MainLayout from './components/MainLayout';
import AddTasks from './pages/AddTasks';
import MyNode from './pages/MyNode';

const Wrapper = (): JSX.Element => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);

const routes = [
  {
    path: '/',
    element: <Wrapper />,
    children: [
      { path: '/my-node', element: <MyNode /> },
      {
        path: '/add-tasks',
        element: <AddTasks />,
      },
      {
        path: '/rewards',
        element: (
          <div className="mt-56 w-1/2 text-center mx-auto text-3xl">
            Rewards
          </div>
        ),
      },
      {
        path: '/notifications',
        element: (
          <div className="mt-56 w-1/2 text-center mx-auto text-3xl">
            Notifications
          </div>
        ),
      },
      {
        path: '/settings',
        element: (
          <div className="mt-56 w-1/2 text-center mx-auto text-3xl">
            Settings
          </div>
        ),
      },
      { path: '/', element: <MyNode /> },
    ],
  },
];

const AppRoutes = (): JSX.Element => {
  return useRoutes(routes);
};

export default AppRoutes;
