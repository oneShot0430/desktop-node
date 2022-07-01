import { Event } from 'electron';
import fs from 'fs';

import { Keypair } from '@_koi/web3.js';
import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';

import mainErrorHandler from '../../utils/mainErrorHandler';

interface createWalletParam {
  mnemonic?: string;
}
const retrieveStakingWalletFromMnemonics = async (
  event: Event,
  payload: createWalletParam
): Promise<string> => {
  console.log('IN CREATE WALLET  API');
  const { mnemonic } = payload;
  try {
    const filePath = 'namespace/' + 'stakingWallet.json';
    console.log('WALLET PATH', filePath);
    let wallet;
    if (mnemonic) {
      const seed = bip39.mnemonicToSeedSync(mnemonic, '');
      const path = "m/44'/501'/99'/0'";
      wallet = Keypair.fromSeed(derivePath(path, seed.toString('hex')).key);
    } else {
      wallet = Keypair.generate();
    }
    console.log('WALLET', wallet.publicKey.toBase58());
    fs.writeFile(
      filePath,
      JSON.stringify(Array.from(wallet.secretKey)),
      (err) => {
        if (err) {
          console.error(err);
        }
      }
    );
    return wallet.publicKey.toBase58();
  } catch (err) {
    console.error(err);
  }
};

export default mainErrorHandler(retrieveStakingWalletFromMnemonics);
