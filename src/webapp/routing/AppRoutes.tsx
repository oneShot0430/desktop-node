import React from 'react';
import { useRoutes } from 'react-router-dom';

import AppLoader from 'webapp/AppLoader';
import AppBoot from 'webapp/AppWrapper';
import {
  CreatePin,
  CreateOrImportAccountWrapper,
  RunFirstTask,
  ConfirmYourStake,
  BackupKeyLater,
  BackupKeyNow,
  ConfirmSecretPhrase,
  PhraseSaveSuccess,
  FundNewKey,
  SeeBalance,
} from 'webapp/components/onboarding';
import { CreateNewKey } from 'webapp/components/onboarding/CreateNewkey';
import { ImportKey } from 'webapp/components/onboarding/ImportKey';
import { ImportKeySuccess } from 'webapp/components/onboarding/ImportKeySuccess';
import { KeyCreationMethodPick } from 'webapp/components/onboarding/KeyCreationMethodPick';

import { History, Settings, AddTasks, MyNode } from '../components';

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
  OnboardingCreateNewKey = '/onboarding/create-or-import-key/create-new-key',
  OnboardingPickKeyCreationMethod = '/onboarding/create-or-import-key/pick-key-creation-method',
  OnboardingImportKey = '/onboarding/create-or-import-key/import-key',
  OnboardingBackupKeyNow = '/onboarding/create-or-import-key/backup-key-now',
  OnboardingBackupKeyLater = '/onboarding/create-or-import-key/backup-key-later',
  OnboardingConfirmSecretPhrase = '/onboarding/create-or-import-key/confirm-backup-secret-phrase',
  OnboardingPhraseImportSuccess = '/onboarding/create-or-import-key/import-key/phrase-import-success',
  OnboardingPhraseSaveSuccess = '/onboarding/create-or-import-key/import-key/phrase-save-success',
  OnboardingFundNewKey = '/onboarding/create-or-import-key/fund-new-key',
  OnboardingSeeBalance = '/onboarding/create-or-import-key/see-balance',
  OnboardingCreateFirstTask = '/onboarding/create-first-task',
  OnboardingConfirmStake = '/onboarding/confirm-stake',
}

export const accountImportRoutes = [
  AppRoute.OnboardingCreateOrImportKey,
  AppRoute.OnboardingCreateNewKey,
  AppRoute.OnboardingPickKeyCreationMethod,
  AppRoute.OnboardingImportKey,
  AppRoute.OnboardingPhraseImportSuccess,
];

const routes = [
  {
    path: AppRoute.Root,
    element: <AppBoot />,
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
      { path: AppRoute.Root, element: <AppLoader /> },

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
                path: AppRoute.OnboardingBackupKeyLater,
                element: <BackupKeyLater />,
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

const AppRoutes = (): JSX.Element => {
  return useRoutes(routes);
};

export default AppRoutes;
