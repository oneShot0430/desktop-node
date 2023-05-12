export interface CreateNodeWalletsResponse {
  stakingWalletPubKey: string;
  mainAccountPubKey: string;
}

export interface CreateNodeWalletsParam {
  mnemonic: string;
  accountName: string;
  encryptedSecretPhrase: string;
}
