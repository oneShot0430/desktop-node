import { Event } from 'electron';
import fs from 'fs';

import { Keypair } from '@_koi/web3.js';

import mainErrorHandler from '../../utils/mainErrorHandler';

interface createWalletParam {
  walletName: string;
}

const createWallet = async (
  event: Event,
  payload: createWalletParam
): Promise<string> => {
  //async function createWallet(walletNameSample: string) {
  const { walletName } = payload;
  //fs.mkdirSync(walletName);
  try {
    const path = 'wallets/' + walletName;
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
      //const filePath = walletName + '/wallet.json';
      const filePath = 'wallets/' + walletName + '/wallet.json';
      console.log('WALLET PATH', filePath);
      const wallet = Keypair.generate();
      console.log('KEY PAIR', wallet);
      console.log('WALLET', wallet.publicKey.toBase58());
      console.log(
        'WALLET INFO TO BE SAVED',
        JSON.stringify(Array.from(wallet.secretKey))
      );
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
    }
  } catch (err) {
    console.error(err);
  }
};

//createWallet('raj');

//export default createWallet;
export default mainErrorHandler(createWallet);
