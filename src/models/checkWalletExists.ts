export interface CheckWalletExistsParameters {
  taskId: string;
}

export interface CheckWalletExistsResponse {
  mainSystemAccount: boolean;
  stakingWallet: boolean;
}
