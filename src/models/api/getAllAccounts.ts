export interface Account {
  accountName: string;
  stakingPublicKey: string;
  mainPublicKey: string;
  isDefault: boolean;
  mainPublicKeyBalance: number;
  stakingPublicKeyBalance: number;
}

export type getAllAccountsResponse = Account[];
