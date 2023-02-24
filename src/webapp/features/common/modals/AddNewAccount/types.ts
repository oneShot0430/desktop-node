export type KeysType = { system: string; task: string };

export type CreateKeyPayload = { keys: KeysType; seedPhrase: string };

export enum Steps {
  ImportKey,
  ImportWithKeyPhrase,
  CreateNewKey,
  KeyCreated,
  ShowSeedPhrase,
  AccountImported,
}
