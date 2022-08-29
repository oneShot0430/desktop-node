import { Event } from 'electron';
import fs from 'fs';

import { Keypair } from '@_koi/web3.js';
import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';

import { CreateNodeWalletsParam, CreateNodeWalletsResponse } from 'models/api';

import mainErrorHandler from '../../utils/mainErrorHandler';

const createNodeWallets = async (
  event: Event,
  payload: CreateNodeWalletsParam
): Promise<CreateNodeWalletsResponse> => {
  console.log('IN CREATE WALLET  API');
  const { mnemonic, accountName } = payload;
  if (!mnemonic) {
    throw new Error('Please provide mnemonic to generate wallets');
  }
  if (!accountName) {
    throw new Error('Please provide accountName to generate wallets');
  }
  try {
    // Creating stakingWallet
    const stakingWalletFilePath = `namespace/${accountName}_stakingWallet.json`;
    if (fs.existsSync(stakingWalletFilePath)) {
      throw new Error('Staking wallet with same account name already exists');
    }
    console.log('WALLET PATH', stakingWalletFilePath);
    const stakingSeed = bip39.mnemonicToSeedSync(mnemonic, '');
    const stakingWalletPath = "m/44'/501'/99'/0'";
    const stakingWallet = Keypair.fromSeed(
      derivePath(stakingWalletPath, stakingSeed.toString('hex')).key
    );
    console.log('Generating Staking wallet from mnemonic');

    console.log('WALLET', stakingWallet.publicKey.toBase58());
    fs.mkdirSync('namespace');
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
    const mainWalletFilePath = `wallets/${accountName}_mainSystemWallet.json`;
    if (fs.existsSync(mainWalletFilePath)) {
      throw new Error('Main wallet with same account name already exists');
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
