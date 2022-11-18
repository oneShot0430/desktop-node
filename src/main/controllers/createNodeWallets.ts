import { Event } from 'electron';
import fs from 'fs';

import { Keypair } from '@_koi/web3.js';
import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';

import { ErrorType } from 'models';
import { CreateNodeWalletsParam, CreateNodeWalletsResponse } from 'models/api';
import { DetailedError } from 'utils';

import mainErrorHandler from '../../utils/mainErrorHandler';
import { getAppDataPath } from '../node/helpers/getAppDataPath';

const createNodeWallets = async (
  event: Event,
  payload: CreateNodeWalletsParam
): Promise<CreateNodeWalletsResponse> => {
  console.log('IN CREATE WALLET  API');
  const { mnemonic, accountName } = payload;
  if (!mnemonic) {
    throw new DetailedError({
      detailed: `Please provide mnemonic to generate wallets, got ${mnemonic}`,
      summary: 'Please provide mnemonic to generate wallets',
      type: ErrorType.NO_MNEMONIC,
    });
  }
  if (!accountName) {
    throw new DetailedError({
      detailed: `Please provide accountName to generate wallets, got ${accountName}`,
      summary: 'Please provide accountName to generate wallets',
      type: ErrorType.NO_VALID_ACCOUNT_NAME,
    });
  }
  if (!fs.existsSync(getAppDataPath() + '/namespace'))
    fs.mkdirSync(getAppDataPath() + '/namespace');
  if (!fs.existsSync(getAppDataPath() + '/wallets'))
    fs.mkdirSync(getAppDataPath() + '/wallets');

  if (!/^[0-9a-zA-Z ... ]+$/.test(accountName)) {
    throw new DetailedError({
      detailed: `Please provide a valid accountName, got ${accountName}`,
      summary: 'Please provide a valid accountName',
      type: ErrorType.NO_VALID_ACCOUNT_NAME,
    });
  }
  try {
    // Creating stakingWallet
    const stakingWalletFilePath =
      getAppDataPath() + `/namespace/${accountName}_stakingWallet.json`;
    if (fs.existsSync(stakingWalletFilePath)) {
      throw new DetailedError({
        detailed: `Staking wallet with same account name ("${accountName}") already exists`,
        summary: 'Staking wallet with same account name already exists',
        type: ErrorType.NO_VALID_ACCOUNT_NAME,
      });
    }
    console.log('WALLET PATH', stakingWalletFilePath);
    const stakingSeed = bip39.mnemonicToSeedSync(mnemonic, '');
    const stakingWalletPath = "m/44'/501'/99'/0'";
    const stakingWallet = Keypair.fromSeed(
      derivePath(stakingWalletPath, stakingSeed.toString('hex')).key
    );
    console.log('Generating Staking wallet from mnemonic');

    console.log('WALLET', stakingWallet.publicKey.toBase58());
    fs.writeFile(
      stakingWalletFilePath,
      JSON.stringify(Array.from(stakingWallet.secretKey)),
      (err) => {
        if (err) {
          console.error(err);
        }
      }
    );
    // Creating MainAccount
    const mainWalletFilePath =
      getAppDataPath() + `/wallets/${accountName}_mainSystemWallet.json`;
    if (fs.existsSync(mainWalletFilePath)) {
      throw new DetailedError({
        detailed: `Main wallet with same account name ("${accountName}") already exists`,
        summary: 'Main wallet with same account name already exists',
        type: ErrorType.NO_VALID_ACCOUNT_NAME,
      });
    }
    console.log('WALLET PATH', mainWalletFilePath);
    const mainSeed = bip39.mnemonicToSeedSync(mnemonic, '');
    const mainWalletPath = "m/44'/501'/0'/0'";
    const mainWallet = Keypair.fromSeed(
      derivePath(mainWalletPath, mainSeed.toString('hex')).key
    );
    console.log('Generating Staking wallet from mnemonic');

    console.log('WALLET', mainWallet.publicKey.toBase58());
    fs.writeFile(
      mainWalletFilePath,
      JSON.stringify(Array.from(mainWallet.secretKey)),
      (err) => {
        if (err) {
          console.error(err);
          throw err;
        }
      }
    );
    return {
      stakingWalletPubKey: stakingWallet.publicKey.toBase58(),
      mainAccountPubKey: mainWallet.publicKey.toBase58(),
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default mainErrorHandler(createNodeWallets);
