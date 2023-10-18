import fs from 'fs';
import path from 'path';

import { Keypair } from '@_koi/web3.js';
import { getAppDataPath } from 'main/node/helpers/getAppDataPath';
import sdk from 'main/services/sdk';
import { getAllAccountsResponse } from 'models/api';

import { getCurrentActiveAccountName } from '../../node/helpers';

export const getAllAccounts = async (
  _: Event,
  shouldFetchBalances?: boolean
): Promise<getAllAccountsResponse> => {
  if (!fs.existsSync(`${getAppDataPath()}/namespace`))
    fs.mkdirSync(`${getAppDataPath()}/namespace`);
  if (!fs.existsSync(`${getAppDataPath()}/wallets`))
    fs.mkdirSync(`${getAppDataPath()}/wallets`);
  const mainWalletFiles = fs.readdirSync(`${getAppDataPath()}/wallets`, {
    withFileTypes: true,
  });
  const mainWalletfilesInDirectory = mainWalletFiles
    .filter((item) => item.isFile() && path.extname(item.name) === '.json')
    .map((item) => item.name);
  const stakingWalletFiles = fs.readdirSync(`${getAppDataPath()}/namespace`, {
    withFileTypes: true,
  });
  const stakingWalletfilesInDirectory = stakingWalletFiles
    .filter((item) => item.isFile() && path.extname(item.name) === '.json')
    .map((item) => item.name);
  const accounts: getAllAccountsResponse = [];

  const activeAccount: string | null =
    await getCurrentActiveAccountName().catch(() => null);

  const promisesArr: Array<Promise<number>> = [];

  mainWalletfilesInDirectory.forEach((e) => {
    const currentAccountName = e.substring(0, e.lastIndexOf('_'));
    const mainSystemWallet = Keypair.fromSecretKey(
      Uint8Array.from(
        JSON.parse(
          fs.readFileSync(`${getAppDataPath()}/wallets/${e}`, 'utf-8')
        ) as Uint8Array
      )
    );
    const stakingWalletNameArr = stakingWalletfilesInDirectory.filter(
      (x) => x.substring(0, x.lastIndexOf('_')) === currentAccountName
    );
    const stakingWalletName =
      stakingWalletNameArr.length > 0 ? stakingWalletNameArr[0] : '';
    if (stakingWalletName === '') return;
    const stakingWallet = Keypair.fromSecretKey(
      Uint8Array.from(
        JSON.parse(
          fs.readFileSync(
            `${getAppDataPath()}/namespace/${stakingWalletName}`,
            'utf-8'
          )
        ) as Uint8Array
      )
    );
    accounts.push({
      accountName: currentAccountName,
      mainPublicKey: mainSystemWallet.publicKey.toBase58(),
      stakingPublicKey: stakingWallet.publicKey.toBase58(),
      isDefault: activeAccount === currentAccountName,
      mainPublicKeyBalance: 0,
      stakingPublicKeyBalance: 0,
    });

    // TODO: we want to add both or just one of the values
    if (shouldFetchBalances) {
      promisesArr.push(sdk.k2Connection.getBalance(mainSystemWallet.publicKey));
      promisesArr.push(sdk.k2Connection.getBalance(stakingWallet.publicKey));
    } else {
      promisesArr.push(Promise.resolve(1000000000));
      promisesArr.push(Promise.resolve(500000000));
    }
  });
  const resolvedPromises = await Promise.allSettled(promisesArr);
  const mappedRes = resolvedPromises.map((e) => {
    return e.status === 'fulfilled' ? e.value : -1;
  });

  accounts.forEach((account, i) => {
    account.mainPublicKeyBalance = mappedRes[2 * i];
    account.stakingPublicKeyBalance = mappedRes[2 * i + 1];
  });

  return accounts;
};
