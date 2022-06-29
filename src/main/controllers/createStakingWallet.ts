import { Event } from 'electron';
import fs from 'fs';

import { Keypair } from '@_koi/web3.js';

import { namespaceInstance } from 'main/node/helpers/Namespace';

import mainErrorHandler from '../../utils/mainErrorHandler';

const createWallet = async (event: Event): Promise<string> => {
  //async function createWallet(walletNameSample: string) {
  //fs.mkdirSync(walletName);
  try {
    const path = 'namespace/';
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
      //const filePath = walletName + '/wallet.json';
      const filePath = 'namespace/' + '/stakingWallet.json';
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
      // namespaceInstance.redisSet(taskId, filePath);
      return wallet.publicKey.toBase58();
    }
  } catch (err) {
    console.error(err);
  }
};

//createWallet('raj');

//export default createWallet;
export default mainErrorHandler(createWallet);
