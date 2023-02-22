import { Event } from 'electron';
import * as fsSync from 'fs';

import { Keypair } from '@_koi/web3.js';

import { ErrorType } from '../../models';
import { GetMainAccountPubKeyResponse } from '../../models/api';
import { throwDetailedError } from '../../utils';
import mainErrorHandler from '../../utils/mainErrorHandler';
import { getAppDataPath } from '../node/helpers/getAppDataPath';
import { namespaceInstance } from '../node/helpers/Namespace';

const mainAccountPubKey = async (
  event: Event
): Promise<GetMainAccountPubKeyResponse> => {
  // console.log('IN THE API');
  let mainSystemAccount;
  let pubkey: string;
  const activeAccount = await namespaceInstance.storeGet('ACTIVE_ACCOUNT');
  if (!activeAccount) {
    return throwDetailedError({
      detailed: 'Please select an active account',
      type: ErrorType.NO_ACTIVE_ACCOUNT,
    });
  }
  const mainWalletfilePath = `${getAppDataPath()}/wallets/${activeAccount}_mainSystemWallet.json`;
  try {
    mainSystemAccount = Keypair.fromSecretKey(
      Uint8Array.from(
        JSON.parse(fsSync.readFileSync(mainWalletfilePath, 'utf-8'))
      )
    );
    pubkey = mainSystemAccount.publicKey.toBase58();
    // console.log('PUBKEY', pubkey);
    return pubkey;
  } catch (e: any) {
    console.error(e);
    return 'null';
  }
};

export default mainErrorHandler(mainAccountPubKey);
