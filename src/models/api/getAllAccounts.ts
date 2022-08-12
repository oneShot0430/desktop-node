export type getAllAccountsResponse = Array<{
  accountName: string;
  stakingPublicKey: string;
  mainPublicKey: string;
  isDefault: boolean;
  mainPublicKeyBalance: number;
  stakingPublicKeyBalance: number;
}>;
