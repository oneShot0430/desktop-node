export interface UserAppConfig {
  onboardingCompleted?: boolean;
  pin?: string;
  firstRewardNotificationDisplayed?: boolean;
  autoUpdatesDisabled?: boolean;
  hasCopiedReferralCode?: boolean;
  alphaUpdatesEnabled?: boolean;
  // when it's enabled it'll keep an ID that's used to disable it, when manually disabled it'll be false, and when unset it won't exist (undefined),
  // so we can differenciate unset from intentionally disabled and then enable it by default on app initialization.
  stayAwake?: number | false;
  launchOnRestart?: boolean;
  tasksThatAlreadyNotifiedUpgradesAvailable?: string[];
  limitLogsSize?: boolean;
  hasStartedEmergencyMigration?: boolean;
  hasFinishedEmergencyMigration?: boolean;
  shownNotifications?: string[];
}

export interface StoreUserConfigParam {
  settings: UserAppConfig;
}
