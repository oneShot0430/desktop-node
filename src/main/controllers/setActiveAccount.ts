import { Event } from 'electron';
import fs from 'fs';

import { Keypair } from '@_koi/web3.js';
import { namespaceInstance } from 'main/node/helpers/Namespace';
import { SetActiveAccountParam } from 'models/api';

import { getAppDataPath } from '../node/helpers/getAppDataPath';

const setActiveAccount = async (
  event: Event,
  payload: SetActiveAccountParam
): Promise<boolean> => {
  const { accountName } = payload;
  console.log('Set Active Account', accountName);
  try {
    const ACTIVE_ACCOUNT = 'ACTIVE_ACCOUNT';

    await namespaceInstance.storeSet(ACTIVE_ACCOUNT, accountName);

    const mainSystemAccountKeyPair = Keypair.fromSecretKey(
      Uint8Array.from(
        JSON.parse(
          fs.readFileSync(
            `${getAppDataPath()}/wallets/${accountName}_mainSystemWallet.json`,
            'utf-8'
          )
        ) as Uint8Array
      )
    );

    // TODO: make "mainSystemAccount" in Task Node class dynamic
    namespaceInstance.mainSystemAccount = mainSystemAccountKeyPair;

    return true;
  } catch (err) {
    console.log('ERROR', err);
    return false;
  }
};

export default setActiveAccount;
