export enum AppRoute {
  Root = '/',
  Unlock = '/unlock',
  MyNode = '/my-node',
  Rewards = '/rewards',
  AddTask = '/add-tasks',
  Notifications = '/notifications',
  Settings = '/settings',
  SettingsGeneral = '/settings/general',
  SettingsSecurity = '/settings/security',
  SettingsExtensions = '/settings/extensions',
  SettingsAutomateNode = '/settings/automate-node',
  SettingsNotifications = '/settings/notifications',
  SettingsHelp = '/settings/help',
  SettingsPrivacy = '/settings/privacy',
  History = '/history',
  Onboarding = '/onboarding',
  // onboarding routes
  OnboardingCreatePin = '/onboarding/create-pin',
  OnboardingCreateOrImportKey = '/onboarding/create-or-import-key',
  OnboardingCreateNewKey = '/onboarding/create-or-import-key/create-new-key',
  OnboardingPickKeyCreationMethod = '/onboarding/create-or-import-key/pick-key-creation-method',
  OnboardingImportKey = '/onboarding/create-or-import-key/import-key',
  OnboardingBackupKeyNow = '/onboarding/create-or-import-key/backup-key-now',
  OnboardingConfirmSecretPhrase = '/onboarding/create-or-import-key/confirm-backup-secret-phrase',
  OnboardingPhraseImportSuccess = '/onboarding/create-or-import-key/import-key/phrase-import-success',
  OnboardingPhraseSaveSuccess = '/onboarding/create-or-import-key/import-key/phrase-save-success',
  OnboardingFundNewKey = '/onboarding/create-or-import-key/fund-new-key',
  OnboardingSeeBalance = '/onboarding/create-or-import-key/see-balance',
  OnboardingCreateFirstTask = '/onboarding/create-first-task',
  OnboardingConfirmStake = '/onboarding/confirm-stake',
}
