import { Event } from 'electron';
import * as fsSync from 'fs';

import { Keypair } from '@_koi/web3.js';

import { namespaceInstance } from 'main/node/helpers/Namespace';
import { GetMainAccountPubKeyResponse } from 'models/api';

import mainErrorHandler from '../../utils/mainErrorHandler';

const mainAccountPubKey = async (
  event: Event
): Promise<GetMainAccountPubKeyResponse> => {
  //console.log('IN THE API');
  let mainSystemAccount;
  let pubkey: string;
  const activeAccount = await namespaceInstance.storeGet('ACTIVE_ACCOUNT');
  if (!activeAccount) {
    throw new Error('Please select a Active Account');
  }
  const mainWalletfilePath = `wallets/${activeAccount}_mainSystemWallet.json`;
  try {
    mainSystemAccount = Keypair.fromSecretKey(
      Uint8Array.from(
        JSON.parse(fsSync.readFileSync(mainWalletfilePath, 'utf-8'))
      )
    );
    pubkey = mainSystemAccount.publicKey.toBase58();
    //console.log('PUBKEY', pubkey);
    return pubkey;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export default mainErrorHandler(mainAccountPubKey);
