import { Event } from 'electron';
import * as fsSync from 'fs';

import { Keypair } from '@_koi/web3.js';

import mainErrorHandler from '../../utils/mainErrorHandler';
import { namespaceInstance } from '../node/helpers/Namespace';

const mainAccountPubKey = async (event: Event): Promise<string> => {
  console.log('IN THE API');
  let mainSystemAccount;
  let pubkey: string;

  if (!(await namespaceInstance.storeGet('WALLET_LOCATION'))) {
    throw Error('WALLET_LOCATION not specified');
  }
  try {
    mainSystemAccount = Keypair.fromSecretKey(
      Uint8Array.from(
        JSON.parse(
          fsSync.readFileSync(
            await namespaceInstance.storeGet('WALLET_LOCATION'),
            'utf-8'
          )
        )
      )
    );
    pubkey = mainSystemAccount.publicKey.toBase58();
    console.log('PUBKEY', pubkey);
    return pubkey;
  } catch (e) {
    console.error(e);
    throw Error("System Account or StakingWallet Account doesn't exist");
  }
};

export default mainErrorHandler(mainAccountPubKey);
