import { Event } from 'electron';
import fs from 'fs';

import { derivePath } from 'ed25519-hd-key';

import { Keypair } from '@_koi/web3.js';
import * as bip39 from 'bip39';
import { ErrorType } from 'models';
import {
  CreateNodeWalletsFromJsonParam,
  CreateNodeWalletsFromJsonResponse,
} from 'models/api';
import { throwDetailedError } from 'utils';

import { getAppDataPath } from '../node/helpers/getAppDataPath';

const createNodeWalletsFromJson = async (
  event: Event,
  payload: CreateNodeWalletsFromJsonParam
): Promise<CreateNodeWalletsFromJsonResponse> => {
  console.log('IN CREATE WALLET FROM JSON  API');
  const { accountName, jsonKey } = payload;
  if (!jsonKey) {
    return throwDetailedError({
      detailed: 'Please provide a json key file to generate wallets',
      type: ErrorType.NO_JSON_KEY,
    });
  }

  if (!accountName) {
    return throwDetailedError({
      detailed: 'Please provide an account name to generate wallets',
      type: ErrorType.NO_VALID_ACCOUNT_NAME,
    });
  }
  if (!fs.existsSync(`${getAppDataPath()}/namespace`))
    fs.mkdirSync(`${getAppDataPath()}/namespace`);
  if (!fs.existsSync(`${getAppDataPath()}/wallets`))
    fs.mkdirSync(`${getAppDataPath()}/wallets`);

  if (!/^[0-9a-zA-Z ... ]+$/.test(accountName)) {
    return throwDetailedError({
      detailed: `Please provide a valid account name, got "${accountName}"`,
      type: ErrorType.NO_VALID_ACCOUNT_NAME,
    });
  }
  try {
    // Creating stakingWallet
    const stakingWalletFilePath = `${getAppDataPath()}/namespace/${accountName}_stakingWallet.json`;
    if (fs.existsSync(stakingWalletFilePath)) {
      return throwDetailedError({
        detailed: `Staking wallet with same account name "${accountName}" already exists`,
        type: ErrorType.NO_VALID_ACCOUNT_NAME,
      });
    }
    const keyPhraseString = jsonKey.join(' ');

    const stakingSeed = bip39.mnemonicToSeedSync(keyPhraseString, '');
    const stakingWalletPath = "m/44'/501'/99'/0'";
    const stakingWallet = Keypair.fromSeed(
      derivePath(stakingWalletPath, stakingSeed.toString('hex')).key
    );
    console.log(stakingWallet, 'StakingWallet');

    // Creating MainAccount
    const mainWalletFilePath = `${getAppDataPath()}/wallets/${accountName}_mainSystemWallet.json`;
    if (fs.existsSync(mainWalletFilePath)) {
      return throwDetailedError({
        detailed: `Main wallet with same account name "${accountName}" already exists`,
        type: ErrorType.NO_VALID_ACCOUNT_NAME,
      });
    }
    const mainWallet = Keypair.fromSecretKey(Buffer.from(jsonKey, 'base64'));
    console.log(mainWallet, 'mAINWallet');

    // Verify a wallet created from the same mnemonic doesn't exist
    const stakingWalletFileContent = JSON.stringify(
      Array.from(stakingWallet.secretKey)
    );
    const mainWalletFileContent = JSON.stringify(
      Array.from(mainWallet.secretKey)
    );
    const existingWalletFiles = fs.readdirSync(`${getAppDataPath()}/wallets`);
    const walletAlreadyExists = existingWalletFiles.some((file) => {
      const fileContent = fs.readFileSync(
        `${getAppDataPath()}/wallets/${file}`
      );
      return fileContent.equals(Buffer.from(mainWalletFileContent));
    });
    if (walletAlreadyExists) {
      return throwDetailedError({
        detailed: 'A wallet with the same mnemonic already exists',
        type: ErrorType.DUPLICATE_ACCOUNT,
      });
    }

    console.log(
      'Generating Staking wallet from mnemonic',
      stakingWallet.publicKey.toBase58()
    );
    console.log(
      'Generating Main wallet from mnemonic',
      mainWallet.publicKey.toBase58()
    );
    fs.writeFile(stakingWalletFilePath, stakingWalletFileContent, (err) => {
      if (err) {
        console.error(err);
        throwDetailedError({
          detailed: err.message,
          type: ErrorType.GENERIC,
        });
      }
    });
    fs.writeFile(mainWalletFilePath, mainWalletFileContent, (err) => {
      if (err) {
        console.error(err);
        throwDetailedError({
          detailed: err.message,
          type: ErrorType.GENERIC,
        });
      }
    });

    return {
      stakingWalletPubKey: stakingWallet.publicKey.toBase58(),
      mainAccountPubKey: mainWallet.publicKey.toBase58(),
    };
  } catch (err: any) {
    console.log('ERROR during Account creation', err);
    return throwDetailedError({
      detailed: err,
      type: ErrorType.GENERIC,
    });
  }
};

export default createNodeWalletsFromJson;