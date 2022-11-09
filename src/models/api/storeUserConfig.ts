export interface UserAppConfig {
  onboardingCompleted?: boolean;
  pin?: string;
}
export interface StoreUserConfigParam {
  settings: UserAppConfig;
}
