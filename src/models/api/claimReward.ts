import { TransactionSignature } from '@_koi/web3.js';

export interface ClaimRewardParam {
  taskAccountPubKey: string;
}

export type ClaimRewardResponse = TransactionSignature;
