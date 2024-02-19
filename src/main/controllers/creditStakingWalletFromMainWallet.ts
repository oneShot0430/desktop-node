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
import { CreditStakingWalletFromMainWalletPayloadType } from 'models';
import { throwTransactionError } from 'utils/error';

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
    throwTransactionError(e);
  }
};
