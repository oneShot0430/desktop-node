export interface UserAppConfig {
  onboardingCompleted?: boolean;
  pin?: string;
  firstRewardNotificationDisplayed?: boolean;
  hasCopiedReferralCode?: boolean;
}
export interface StoreUserConfigParam {
  settings: UserAppConfig;
}
