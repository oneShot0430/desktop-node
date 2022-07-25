import { Event } from 'electron';
import * as fsSync from 'fs';

import { Keypair } from '@_koi/web3.js';

import { GetMainAccountPubKeyResponse } from 'models/api';

import mainErrorHandler from '../../utils/mainErrorHandler';

const mainAccountPubKey = async (
  event: Event
): Promise<GetMainAccountPubKeyResponse> => {
  //console.log('IN THE API');
  let mainSystemAccount;
  let pubkey: string;

  try {
    mainSystemAccount = Keypair.fromSecretKey(
      Uint8Array.from(
        JSON.parse(fsSync.readFileSync('mainSystemWallet.json', 'utf-8'))
      )
    );
    pubkey = mainSystemAccount.publicKey.toBase58();
    //console.log('PUBKEY', pubkey);
    return pubkey;
  } catch (e) {
    console.error(e);
    throw Error("System Account or StakingWallet Account doesn't exist");
  }
};

export default mainErrorHandler(mainAccountPubKey);
