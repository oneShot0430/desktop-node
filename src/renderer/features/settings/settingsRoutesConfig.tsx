import {
  ExtentionPuzzleLine,
  ExtentionPuzzleFill,
  KeyUnlockLine,
  NotificationOnLine,
  NotificationOffFill,
  SettingsFill,
  SettingsLine,
  LockLine,
  LockFill,
  TooltipChatQuestionLeftFill,
  TooltipChatQuestionRightLine,
  BrowseInternetLine,
} from '@_koii/koii-styleguide';
import React from 'react';

import Time from 'assets/svgs/Time.svg';
import TimeFill from 'assets/svgs/TimeFill.svg';
import { AppRoute } from 'renderer/types/routes';

import {
  AutomateSettings,
  GeneralSettings,
  NotificationsSettings,
  SecuritySettings,
  TaskExtensionsSettings,
  Privacy,
  Help,
  NetworkAndUPNPSettings,
} from './components';
import { SettingsSection } from './types';

export const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    label: 'General',
    icon: SettingsLine,
    iconFocused: SettingsFill,
    path: AppRoute.SettingsGeneral,
    component: GeneralSettings,
  },
  {
    label: 'Security',
    icon: KeyUnlockLine,
    iconFocused: KeyUnlockLine,
    path: AppRoute.SettingsSecurity,
    component: SecuritySettings,
  },
  {
    label: 'Task Extensions',
    icon: ExtentionPuzzleLine,
    iconFocused: ExtentionPuzzleFill,
    path: AppRoute.SettingsExtensions,
    component: TaskExtensionsSettings,
  },
  {
    label: 'Automate Node',
    icon: (props) => <Time {...props} />,
    iconFocused: (props) => <TimeFill {...props} />,
    path: AppRoute.SettingsAutomateNode,
    component: AutomateSettings,
  },
  {
    label: 'Network',
    icon: BrowseInternetLine,
    iconFocused: BrowseInternetLine,
    path: AppRoute.SettingsNetworkAndUPNP,
    component: NetworkAndUPNPSettings,
  },
  {
    label: 'Notifications',
    icon: NotificationOnLine,
    iconFocused: NotificationOffFill,
    path: AppRoute.SettingsNotifications,
    component: NotificationsSettings,
    disabled: true,
  },
  {
    label: 'Privacy',
    icon: LockLine,
    iconFocused: LockFill,
    path: AppRoute.SettingsPrivacy,
    component: Privacy,
  },
  {
    label: 'Help',
    icon: TooltipChatQuestionRightLine,
    iconFocused: TooltipChatQuestionLeftFill,
    path: AppRoute.SettingsHelp,
    component: Help,
  },
];
