import { Event } from 'electron';
import fs from 'fs';

import { RemoveAccountByNameParam } from 'models/api';

import mainErrorHandler from '../../utils/mainErrorHandler';

const removeAccountByName = async (
  event: Event,
  payload: RemoveAccountByNameParam
): Promise<boolean> => {
  const { accountName } = payload;
  try {
    fs.unlinkSync(`namespace/${accountName}_stakingWallet.json`);
    fs.unlinkSync(`wallets/${accountName}_mainSystemWallet.json`);
    return true;
  } catch (err) {
    console.log('ERROR', err);
    throw Error('No account exists with the specified name');
  }
};

export default mainErrorHandler(removeAccountByName);