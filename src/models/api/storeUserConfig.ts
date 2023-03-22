export interface UserAppConfig {
  onboardingCompleted?: boolean;
  pin?: string;
  firstRewardNotificationDisplayed?: boolean;
  // network?: string;
}
export interface StoreUserConfigParam {
  settings: UserAppConfig;
}
