export interface UserAppConfig {
  onboardingCompleted?: boolean;
  pin?: string;
  firstRewardNotificationDisplayed?: boolean;
  autoUpdatesDisabled?: boolean;
  hasCopiedReferralCode?: boolean;
  alphaUpdatesEnabled?: boolean;
}

export interface StoreUserConfigParam {
  settings: UserAppConfig;
}
