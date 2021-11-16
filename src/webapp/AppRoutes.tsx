import React from 'react';
import { useRoutes, Outlet } from 'react-router-dom';

import MainLayout from './components/MainLayout';
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
      { path: '/add-tasks', element: <div> Add tasks</div> },
      { path: '/rewards', element: <div> Rewards </div> },
      { path: '/notifications', element: <div> Notifications </div> },
      { path: '/settings', element: <div> Settings </div> },
      { path: '/', element: <MyNode /> },
    ],
  },
];

const AppRoutes = (): JSX.Element => {
  return useRoutes(routes);
};

export default AppRoutes;
