export interface SecretData {
  value: string;
  label: string;
}

export type UserSecrets = Record<string, SecretData>;
