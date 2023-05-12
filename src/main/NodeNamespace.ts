import fs from 'fs';

import { Keypair } from '@_koi/web3.js';
import {
  TaskNodeBase,
  TaskNodeConfig,
  IDatabase,
} from '@koii-network/task-node';

import { getAppDataPath } from './node/helpers/getAppDataPath';

const ACTIVE_ACCOUNT = 'ACTIVE_ACCOUNT';

// FIXME(Chris): use methods from wallets.ts
export class NodeNamespace extends TaskNodeBase {
  appDataPath: string;

  constructor(config: TaskNodeConfig) {
    super(config);

    this.appDataPath = getAppDataPath();
  }

  // eslint-disable-next-line class-methods-use-this
  async getMainSystemAccountPubKey(db?: IDatabase): Promise<Keypair> {
    if (!db) throw new Error('No database provided');

    const activeAccount = await db.get(ACTIVE_ACCOUNT);

    if (!activeAccount) {
      throw new Error('No active account found');
    }

    const mainSystemAccountRetrieved = Keypair.fromSecretKey(
      Uint8Array.from(
        JSON.parse(
          fs.readFileSync(
            `${getAppDataPath()}/wallets/${activeAccount}_mainSystemWallet.json`,
            'utf-8'
          )
        ) as Uint8Array
      )
    );

    return mainSystemAccountRetrieved;
  }

  async getSubmitterAccount(): Promise<Keypair | null> {
    let submitterAccount: Keypair | null;
    try {
      const activeAccount = await this.storeGetRaw(ACTIVE_ACCOUNT);
      const STAKING_WALLET_PATH = `${getAppDataPath()}/namespace/${activeAccount}_stakingWallet.json`;
      if (!fs.existsSync(STAKING_WALLET_PATH)) return null;
      submitterAccount = Keypair.fromSecretKey(
        Uint8Array.from(
          JSON.parse(
            fs.readFileSync(STAKING_WALLET_PATH, 'utf-8')
          ) as Uint8Array
        )
      );
    } catch (e) {
      console.error(
        'Staking wallet not found. Please create a staking wallet and place it in the namespace folder'
      );
      submitterAccount = null;
    }
    return submitterAccount;
  }

  async getDistributionAccount(): Promise<Keypair | null> {
    let distributionAccount: Keypair | null;

    try {
      const activeAccount = await this.storeGetRaw(ACTIVE_ACCOUNT);
      /**
       * @dev - This is the path to the staking wallet, but we will use it as the distribution wallet
       */
      const STAKING_WALLET_PATH = `${getAppDataPath()}/namespace/${activeAccount}_stakingWallet.json`;

      if (!fs.existsSync(STAKING_WALLET_PATH)) return null;

      distributionAccount = Keypair.fromSecretKey(
        Uint8Array.from(
          JSON.parse(
            fs.readFileSync(STAKING_WALLET_PATH, 'utf-8')
          ) as Uint8Array
        )
      );
    } catch (e) {
      console.error(
        'Distribution wallet not found. Please create a staking wallet and place it in the namespace folder'
      );
      distributionAccount = null;
    }
    return distributionAccount;
  }
}
