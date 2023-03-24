import fs from 'fs';

import { Keypair } from '@_koi/web3.js';
import { TaskNodeBase, TaskNodeConfig, IDatabase } from '@_koii/k2-node';

import { getAppDataPath } from './node/helpers/getAppDataPath';

const ACTIVE_ACCOUNT = 'ACTIVE_ACCOUNT';

export class NodeNamespace extends TaskNodeBase {
  appDataPath: string;

  constructor(config: TaskNodeConfig) {
    super(config);

    this.appDataPath = getAppDataPath();
  }

  // eslint-disable-next-line class-methods-use-this
  async getMainSystemAccountPubKey(db: IDatabase): Promise<Keypair> {
    const activeAccount = await db.get(ACTIVE_ACCOUNT);

    console.log('@@@@ACTIVE_ACCOUNT', activeAccount);

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
      console.log({ STAKING_WALLET_PATH });
      if (!fs.existsSync(STAKING_WALLET_PATH)) return null;
      submitterAccount = Keypair.fromSecretKey(
        Uint8Array.from(
          JSON.parse(
            fs.readFileSync(STAKING_WALLET_PATH, 'utf-8')
          ) as Uint8Array
        )
      );
      console.log({ submitterAccount });
    } catch (e) {
      console.error(
        'Staking wallet not found. Please create a staking wallet and place it in the namespace folder'
      );
      submitterAccount = null;
    }
    return submitterAccount;
  }
}