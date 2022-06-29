import { Event } from 'electron';
import fs from 'fs';

import { Keypair } from '@_koi/web3.js';

import { namespaceInstance } from 'main/node/helpers/Namespace';

import mainErrorHandler from '../../utils/mainErrorHandler';

const createWallet = async (event: Event): Promise<string> => {
  console.log('IN CREATE WALLET  API');
  try {
    const filePath = 'namespace/' + 'stakingWallet.json';
    console.log('WALLET PATH', filePath);
    const wallet = Keypair.generate();
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

export default mainErrorHandler(createWallet);
