import { Event } from 'electron';
import fs from 'fs';

import { namespaceInstance } from 'main/node/helpers/Namespace';
import { StoreMainWalletParam } from 'models/api';

import mainErrorHandler from '../../utils/mainErrorHandler';

const storeWallet = async (
  event: Event,
  payload: StoreMainWalletParam
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
