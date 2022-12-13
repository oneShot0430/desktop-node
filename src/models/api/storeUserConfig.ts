export interface UserAppConfig {
  onboardingCompleted?: boolean;
  pin?: string;
  firstRewardNotificationDisplayed?: boolean;
}
export interface StoreUserConfigParam {
  settings: UserAppConfig;
}
