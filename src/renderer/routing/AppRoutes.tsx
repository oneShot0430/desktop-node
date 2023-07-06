import React from 'react';
import { useRoutes } from 'react-router-dom';

import AppLoader from 'renderer/AppLoader';
import AppBoot from 'renderer/AppWrapper';
import { Settings } from 'renderer/features';
import {
  CreatePin,
  CreateOrImportAccountWrapper,
  BackupKeyNow,
  ConfirmSecretPhrase,
  FundNewKey,
  SeeBalance,
  PhraseSaveSuccess,
  RunFirstTask,
  ConfirmYourStake,
  KeyCreationMethodPick,
  CreateNewKey,
  ImportKey,
  ImportKeySuccess,
} from 'renderer/features/onboarding';
import { AppRoute } from 'renderer/types/routes';

import { History, AvailableTasks, MyNode, Unlock } from '../components';

const routes = [
  { path: AppRoute.Unlock, element: <Unlock /> },
  {
    path: AppRoute.Root,
    element: <AppBoot />,
    children: [
      { path: AppRoute.Root, element: <AppLoader /> },
      { path: AppRoute.MyNode, element: <MyNode /> },
      {
        path: AppRoute.AddTask,
        element: <AvailableTasks />,
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

      {
        path: AppRoute.Onboarding,
        children: [
          {
            path: AppRoute.OnboardingCreatePin,
            element: <CreatePin />,
          },
          {
            path: AppRoute.OnboardingCreateOrImportKey,

            element: <CreateOrImportAccountWrapper />,
            children: [
              {
                path: AppRoute.OnboardingPickKeyCreationMethod,
                element: <KeyCreationMethodPick />,
              },
              {
                path: AppRoute.OnboardingCreateNewKey,
                element: <CreateNewKey />,
              },
              {
                path: AppRoute.OnboardingBackupKeyNow,
                element: <BackupKeyNow />,
              },
              {
                path: AppRoute.OnboardingConfirmSecretPhrase,
                element: <ConfirmSecretPhrase />,
              },
              {
                path: AppRoute.OnboardingImportKey,
                element: <ImportKey />,
              },
              {
                path: AppRoute.OnboardingFundNewKey,
                element: <FundNewKey />,
              },
              {
                path: AppRoute.OnboardingSeeBalance,
                element: <SeeBalance />,
              },
              {
                path: AppRoute.OnboardingPhraseImportSuccess,
                element: <ImportKeySuccess />,
              },
              {
                path: AppRoute.OnboardingPhraseSaveSuccess,
                element: <PhraseSaveSuccess />,
              },
            ],
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
    ],
  },
];

const AppRoutes = () => {
  return useRoutes(routes);
};

export default AppRoutes;
