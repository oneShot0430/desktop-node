import { Event } from 'electron';
import fs from 'fs';
import path from 'path';

import { Keypair } from '@_koi/web3.js';

import { namespaceInstance } from 'main/node/helpers/Namespace';
import { getAllAccountsResponse } from 'models/api';

import mainErrorHandler from '../../utils/mainErrorHandler';

const getAllAccounts = async (
  event: Event,
  payload: any
): Promise<getAllAccountsResponse> => {
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
  const activeAccount = await namespaceInstance.storeGet('ACTIVE_ACCOUNT');

  mainWalletfilesInDirectory.forEach((e) => {
    const currentAccountName = e.substring(0, e.lastIndexOf('_'));
    const mainSystemWallet = Keypair.fromSecretKey(
      Uint8Array.from(JSON.parse(fs.readFileSync(`wallets/${e}`, 'utf-8')))
    );
    const stakingWalletNameArr = stakingWalletfilesInDirectory.filter(
      (x) => x.substring(0, x.lastIndexOf('_')) == currentAccountName
    );
    const stakingWalletName =
      stakingWalletNameArr.length > 0 ? stakingWalletNameArr[0] : '';
    const stakingWallet = Keypair.fromSecretKey(
      Uint8Array.from(
        JSON.parse(fs.readFileSync(`namespace/${stakingWalletName}`, 'utf-8'))
      )
    );
    accounts.push({
      accountName: currentAccountName,
      mainPublicKey: mainSystemWallet.publicKey.toBase58(),
      stakingPublicKey: stakingWallet.publicKey.toBase58(),
      isDefault: activeAccount == currentAccountName,
    });
  });
  return accounts;
};

export default mainErrorHandler(getAllAccounts);
