export interface UserAppConfig {
  onboardingCompleted?: boolean;
  pin?: string;
  firstRewardNotificationDisplayed?: boolean;
  autoUpdatesEnabled?: boolean;
  hasCopiedReferralCode?: boolean;
  alphaUpdatesEnabled?: boolean;
}

export interface StoreUserConfigParam {
  settings: UserAppConfig;
}
