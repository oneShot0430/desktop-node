import { TransactionSignature } from '@_koi/web3.js';

export interface DelegateStakeParam {
  taskAccountPubKey: string;
  stakeAmount: number;
}

export type DelegateStakeResponse = TransactionSignature;
