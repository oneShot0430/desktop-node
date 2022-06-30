import { Event } from 'electron';
import fs from 'fs';

import { namespaceInstance } from 'main/node/helpers/Namespace';

import mainErrorHandler from '../../utils/mainErrorHandler';

interface storeWalletParam {
  walletPath: string;
}

const storeWallet = async (
  event: Event,
  payload: storeWalletParam
): Promise<boolean> => {
  console.log('IN THE API');
  const { walletPath } = payload;

  const path = walletPath;
  console.log('PATH', path);
  try {
    if (!fs.existsSync(walletPath)) throw Error('Invalid Wallet Path');
    const wallet = 'WALLET_LOCATION';
    namespaceInstance.storeSet(wallet, path);
    return true;
  } catch (err) {
    console.log('ERROR', err);
  }
};

export default mainErrorHandler(storeWallet);
