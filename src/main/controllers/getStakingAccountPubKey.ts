import { Event } from 'electron';
import * as fsSync from 'fs';
import fs from 'fs';

import { Keypair } from '@_koi/web3.js';

import mainErrorHandler from '../../utils/mainErrorHandler';

const stakingAccountPubKey = async (event: Event): Promise<string> => {
  console.log('IN THE API');
  let stakingAccount;
  let pubkey: string;
  const walletPath = 'namespace/' + 'stakingWallet.json';
  if (fs.existsSync(walletPath)) {
    try {
      stakingAccount = Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(fsSync.readFileSync(walletPath, 'utf-8')))
      );
      pubkey = stakingAccount.publicKey.toBase58();
      console.log('PUBKEY', pubkey);
      return pubkey;
    } catch (e) {
      console.error(e);
      throw Error("System Account or StakingWallet Account doesn't exist");
    }
  } else {
    console.log('Staking wakket do not exists at ', walletPath);
  }
};

export default mainErrorHandler(stakingAccountPubKey);
