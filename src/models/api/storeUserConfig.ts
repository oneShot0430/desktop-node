type secretId = string;
type encryptedSecret = string;

export interface UserAppConfig {
  onboardingCompleted?: boolean;
  pin?: string;
  secrets?: Record<secretId, encryptedSecret>;
}
export interface StoreUserConfigParam {
  settings: UserAppConfig;
}
