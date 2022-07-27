import { Event } from 'electron';
import fs from 'fs';
import path from 'path';

import { getAllAccountsResponse } from 'models/api';

import mainErrorHandler from '../../utils/mainErrorHandler';

const getAllAccounts = (event: Event, payload: any): getAllAccountsResponse => {
  const mainWalletFiles = fs.readdirSync('wallets', { withFileTypes: true });
  const mainWalletfilesInDirectory = mainWalletFiles
    .filter((item) => item.isFile() && path.extname(item.name) === '.json')
    .map((item) => item.name);
  const stakingWalletFiles = fs.readdirSync('namespace', {
    withFileTypes: true,
  });
  const stakingWalletfilesInDirectory = stakingWalletFiles
    .filter((item) => item.isFile() && path.extname(item.name) === '.json')
    .map((item) => item.name);
  const accounts: getAllAccountsResponse = [];
  mainWalletfilesInDirectory.forEach((e) => {
    const accountName = e.substring(0, e.lastIndexOf('_'));
    const mainPublicKey = e.substring(e.lastIndexOf('_'), e.length - 5);
    const stakingWalletNameArr = stakingWalletfilesInDirectory.filter(
      (x) => x.substring(0, x.lastIndexOf('_')) == accountName
    );
    const stakingWalletName =
      stakingWalletNameArr.length > 0 ? stakingWalletNameArr[0] : '';
    const stakingPublicKey = stakingWalletName.substring(
      e.lastIndexOf('_'),
      e.length - 5
    );
    accounts.push({
      accountName,
      mainPublicKey,
      stakingPublicKey,
    });
  });
  return accounts;
};

export default mainErrorHandler(getAllAccounts);
