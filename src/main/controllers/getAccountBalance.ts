import { Event } from 'electron';

import { PublicKey } from '@_koi/web3.js';
import sdk from 'main/services/sdk';

const getAccountBalance = async (
  event: Event,
  pubkey: string
): Promise<number> =>
  sdk.k2Connection.getBalance(new PublicKey(pubkey), 'processed');

export default getAccountBalance;
