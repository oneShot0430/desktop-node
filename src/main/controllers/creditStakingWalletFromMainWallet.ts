import {
  sendAndConfirmTransaction,
  Transaction,
  SystemProgram,
} from '@_koi/web3.js';
import {
  getMainSystemAccountKeypair,
  getStakingAccountKeypair,
} from 'main/node/helpers';
import sdk from 'main/services/sdk';
import {
  CreditStakingWalletFromMainWalletPayloadType,
  ErrorType,
  NetworkErrors,
} from 'models';
import { throwDetailedError } from 'utils/error';

export const creditStakingWalletFromMainWallet = async (
  _: Event,
  { amountInRoe }: CreditStakingWalletFromMainWalletPayloadType
) => {
  try {
    const mainSystemAccountKeyPair = await getMainSystemAccountKeypair();
    const stakingAccountKeyPair = await getStakingAccountKeypair();

    console.log(`
    FUNDING STAKING WALLET
    From: ${mainSystemAccountKeyPair.publicKey.toBase58()}
    To: ${stakingAccountKeyPair.publicKey.toBase58()}
    Amount in Roe: ${amountInRoe}
    `);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: mainSystemAccountKeyPair.publicKey,
        toPubkey: stakingAccountKeyPair.publicKey,
        lamports: amountInRoe,
      })
    );

    const transactionResponse = await sendAndConfirmTransaction(
      sdk.k2Connection,
      transaction,
      [mainSystemAccountKeyPair, stakingAccountKeyPair]
    );

    return transactionResponse;
  } catch (e: unknown) {
    console.error(e);
    const errorType = (e as { message: string }).message
      .toLowerCase()
      .includes(NetworkErrors.TRANSACTION_TIMEOUT)
      ? ErrorType.TRANSACTION_TIMEOUT
      : ErrorType.GENERIC;
    return throwDetailedError({
      detailed: (e as { message: string }).message,
      type: errorType,
    });
  }
};
